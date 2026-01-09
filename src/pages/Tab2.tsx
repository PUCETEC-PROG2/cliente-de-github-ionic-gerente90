import React, { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonLabel,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
} from '@ionic/react';
import './Tab2.css';
import { useHistory } from 'react-router-dom';
import { createRepository } from '../services/GithubService';

type ToastState = {
  open: boolean;
  message: string;
  color: 'success' | 'danger' | 'warning';
};

const Tab2: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    color: 'success',
  });

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setToast({
        open: true,
        message: 'El nombre del repositorio es obligatorio',
        color: 'warning',
      });
      return;
    }

    try {
      setCreating(true);
      const newRepo = await createRepository({
        name: trimmedName,
        description: description.trim() || undefined,
        private: isPrivate,
      });

      // Guardar en localStorage para mantener un caché mínimo
      const stored = localStorage.getItem('repos');
      const repos = stored ? JSON.parse(stored) : [];
      localStorage.setItem('repos', JSON.stringify([newRepo, ...repos]));

      setToast({
        open: true,
        message: `Repositorio "${newRepo.name}" creado correctamente`,
        color: 'success',
      });
      setName('');
      setDescription('');
      setIsPrivate(false);

      window.dispatchEvent(new CustomEvent('repos:refresh'));
      history.push('/tab1');
    } catch (error: any) {
      console.error(error);
      setToast({
        open: true,
        message: error?.message || 'No se pudo crear el repositorio',
        color: 'danger',
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear repositorio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Formulario de repositorio</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="create-repo-wrapper">
          <IonCard className="create-repo-card">
            <IonCardHeader>
              <IonCardSubtitle>GitHub</IonCardSubtitle>
              <IonCardTitle>Nuevo repositorio</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p className="helper-text">
                Completa los campos para crear un repositorio directamente en tu cuenta de GitHub.
              </p>
              <div className="form-group">
                <IonLabel>Nombre</IonLabel>
                <IonInput
                  className="form-field"
                  fill="outline"
                  placeholder="mi-nuevo-proyecto"
                  value={name}
                  inputmode="text"
                  autocapitalize="off"
                  onIonChange={(event) => setName(event.detail.value ?? '')}
                />
                <IonText color="medium">Usa minúsculas, números y guiones.</IonText>
              </div>

              <div className="form-group">
                <IonLabel>Descripción</IonLabel>
                <IonTextarea
                  className="form-field"
                  fill="outline"
                  autoGrow
                  placeholder="Objetivo, stack o notas del repositorio"
                  value={description}
                  onIonChange={(event) => setDescription(event.detail.value ?? '')}
                />
              </div>

              <div className="toggle-row">
                <div>
                  <p className="toggle-title">Repositorio privado</p>
                  <IonText color="medium">Solo tú y tus colaboradores lo verán.</IonText>
                </div>
                <IonToggle
                  checked={isPrivate}
                  onIonChange={(event) => setIsPrivate(event.detail.checked)}
                />
              </div>

              <IonButton
                expand="block"
                className="form-button"
                onClick={handleSubmit}
                disabled={creating}
              >
                {creating ? 'Creando...' : 'Crear repositorio'}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={toast.open}
          onDidDismiss={() => setToast({ ...toast, open: false })}
          message={toast.message}
          duration={2600}
          color={toast.color}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
