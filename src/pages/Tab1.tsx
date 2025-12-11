import React, { useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import RepoList from '../components/RepoItem';
import { useHistory } from 'react-router-dom';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { fetchRepositories } from '../services/GithubService';

const Tab1: React.FC = () => {
  const [repos, setRepos] = React.useState<RepositoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const history = useHistory();

  // Datos de muestra como fallback
  const sampleRepos = [
    { id: 1, name: 'Repositorio 1', description: 'Repositorio de ejemplo', ownerAvatarUrl: 'https://avatars.githubusercontent.com/u/9919?s=64&v=4' },
    { id: 2, name: 'Repositorio 2', description: 'Otro repositorio de prueba', ownerAvatarUrl: 'https://avatars.githubusercontent.com/u/583231?s=64&v=4' },
    { id: 3, name: 'Repositorio 3', description: 'Proyecto Ionic demo', ownerAvatarUrl: 'https://avatars.githubusercontent.com/u/583231?s=64&v=4' },
  ];

  // Cargar repositorios al montar el componente
  useEffect(() => {
    const loadRepos = async () => {
      setLoading(true);
      try {
        const reposData = await fetchRepositories();
        
        // Si la API retorna datos, usar esos; si no, usar localStorage o muestra
        if (reposData && reposData.length > 0) {
          setRepos(reposData);
        } else {
          const stored = localStorage.getItem('repos');
          const localRepos = stored ? JSON.parse(stored) : sampleRepos;
          setRepos(localRepos);
        }
      } catch (error) {
        console.error('Error loading repos:', error);
        // En caso de error, usar localStorage o muestra
        const stored = localStorage.getItem('repos');
        const localRepos = stored ? JSON.parse(stored) : sampleRepos;
        setRepos(localRepos);
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, []);

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
        <RepoList repos={repos} onSelect={handleSelect} />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
