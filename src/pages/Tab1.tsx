import React from 'react';
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonModal,
  IonPage,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import './Tab1.css';
import RepoList from '../components/RepoItem';
import { useHistory } from 'react-router-dom';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { deleteRepository, fetchRepositories, updateRepository } from '../services/GithubService';

const SAMPLE_REPOS: RepositoryItem[] = [
  {
    id: 1,
    name: 'Repositorio 1',
    description: 'Repositorio de ejemplo',
    owner: 'github',
    ownerAvatarUrl: 'https://avatars.githubusercontent.com/u/9919?s=64&v=4',
    imageUrl: 'https://avatars.githubusercontent.com/u/9919?s=64&v=4',
    language: 'TypeScript',
  },
  {
    id: 2,
    name: 'Repositorio 2',
    description: 'Otro repositorio de prueba',
    owner: 'octocat',
    ownerAvatarUrl: 'https://avatars.githubusercontent.com/u/583231?s=64&v=4',
    imageUrl: 'https://avatars.githubusercontent.com/u/583231?s=64&v=4',
    language: 'JavaScript',
  },
  {
    id: 3,
    name: 'Repositorio 3',
    description: 'Proyecto Ionic demo',
    owner: 'ionic-team',
    ownerAvatarUrl: 'https://avatars.githubusercontent.com/u/3171503?s=64&v=4',
    imageUrl: 'https://avatars.githubusercontent.com/u/3171503?s=64&v=4',
    language: 'Ionic',
  },
];

const Tab1: React.FC = () => {
  const [repos, setRepos] = React.useState<RepositoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editingRepo, setEditingRepo] = React.useState<RepositoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<RepositoryItem | null>(null);
  const [editName, setEditName] = React.useState('');
  const [editDescription, setEditDescription] = React.useState('');
  const [toast, setToast] = React.useState<{ open: boolean; message: string; color: 'success' | 'danger' | 'warning' }>({
    open: false,
    message: '',
    color: 'success',
  });
  const history = useHistory();

  const getLocalRepos = React.useCallback((): RepositoryItem[] => {
    const stored = localStorage.getItem('repos');
    return stored ? JSON.parse(stored) : SAMPLE_REPOS;
  }, []);

  const syncRepos = React.useCallback((list: RepositoryItem[]) => {
    setRepos(list);
    localStorage.setItem('repos', JSON.stringify(list));
  }, []);

  const loadRepos = React.useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const reposData = await fetchRepositories();
      
      if (reposData && reposData.length > 0) {
        syncRepos(reposData);
      } else {
        setRepos(getLocalRepos());
      }
    } catch (error) {
      console.error('Error loading repos:', error);
      setRepos(getLocalRepos());
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [getLocalRepos, syncRepos]);

  React.useEffect(() => {
    loadRepos();
  }, [loadRepos]);

  React.useEffect(() => {
    const refreshHandler = () => loadRepos();
    window.addEventListener('repos:refresh', refreshHandler);

    return () => {
      window.removeEventListener('repos:refresh', refreshHandler);
    };
  }, [loadRepos]);

  useIonViewWillEnter(() => {
    loadRepos();
  });
  const showToast = (message: string, color: 'success' | 'danger' | 'warning') => {
    setToast({ open: true, message, color });
  };

  const openEditModal = (repo: RepositoryItem) => {
    setEditingRepo(repo);
    setEditName(repo.name);
    setEditDescription(repo.description ?? '');
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingRepo(null);
    setEditName('');
    setEditDescription('');
  };

  const submitEdit = async () => {
    if (!editingRepo) return;
    if (!editingRepo.owner) {
      showToast('No se puede editar un repositorio sin información del owner.', 'warning');
      return;
    }

    const trimmedName = editName.trim();
    if (!trimmedName) {
      showToast('El nombre no puede estar vacío.', 'warning');
      return;
    }

    setActionLoading(true);
    try {
      const updated = await updateRepository(editingRepo.owner, editingRepo.name, {
        name: trimmedName,
        description: editDescription.trim() || null,
      });
      syncRepos(
        repos.map((repo) =>
          repo.id === updated.id ? { ...repo, ...updated } : repo
        )
      );
      showToast('Repositorio actualizado correctamente.', 'success');
      closeEditModal();
      await loadRepos({ showLoading: false });
    } catch (error: any) {
      console.error(error);
      showToast(error?.message || 'No se pudo actualizar el repositorio.', 'danger');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = (repo: RepositoryItem) => {
    setDeleteTarget(repo);
  };

  const performDelete = async () => {
    if (!deleteTarget) return;
    if (!deleteTarget.owner) {
      showToast('No se puede eliminar un repositorio sin información del owner.', 'warning');
      setDeleteTarget(null);
      return;
    }

    setActionLoading(true);
    try {
      await deleteRepository(deleteTarget.owner, deleteTarget.name);
      const filtered = repos.filter((repo) => repo.id !== deleteTarget.id);
      syncRepos(filtered);
      showToast(`Repositorio "${deleteTarget.name}" eliminado.`, 'success');
      setDeleteTarget(null);
      await loadRepos({ showLoading: false });
    } catch (error: any) {
      console.error(error);
      showToast(error?.message || 'No se pudo eliminar el repositorio.', 'danger');
    } finally {
      setActionLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleSelect = (repo: any) => {
    history.push(`/repo/${repo.id}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>
        {loading ? (
          <div className="repo-loading">
            <IonSpinner name="crescent" />
            <p>Cargando repositorios...</p>
          </div>
        ) : (
          <RepoList
            repos={repos}
            onSelect={handleSelect}
            onEdit={(repo) => openEditModal(repo as RepositoryItem)}
            onDelete={(repo) => confirmDelete(repo as RepositoryItem)}
          />
        )}
      </IonContent>

      <IonModal isOpen={editModalOpen} onDidDismiss={closeEditModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Editar repositorio</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={closeEditModal}>Cerrar</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="edit-modal-content">
          <div className="edit-form">
            <IonInput
              label="Nombre"
              labelPlacement="floating"
              fill="outline"
              value={editName}
              onIonChange={(event) => setEditName(event.detail.value ?? '')}
            />
            <IonTextarea
              label="Descripción"
              labelPlacement="floating"
              fill="outline"
              autoGrow
              value={editDescription}
              onIonChange={(event) => setEditDescription(event.detail.value ?? '')}
            />
            <IonButton expand="block" onClick={submitEdit} disabled={actionLoading}>
              {actionLoading ? 'Guardando...' : 'Guardar cambios'}
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      <IonAlert
        isOpen={Boolean(deleteTarget)}
        header="Eliminar repositorio"
        message={`¿Deseas eliminar "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => setDeleteTarget(null),
          },
          {
            text: 'Eliminar',
            role: 'confirm',
            handler: () => {
              performDelete();
            },
          },
        ]}
        onDidDismiss={(event) => {
          if (event.detail.role !== 'confirm') {
            setDeleteTarget(null);
          }
        }}
      />

      <IonLoading isOpen={actionLoading} message="Aplicando cambios..." />

      <IonToast
        isOpen={toast.open}
        message={toast.message}
        duration={2200}
        color={toast.color}
        onDidDismiss={() => setToast({ ...toast, open: false })}
      />
    </IonPage>
  );
};

export default Tab1;
