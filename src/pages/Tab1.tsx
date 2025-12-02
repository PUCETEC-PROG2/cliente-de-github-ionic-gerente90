import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import RepoList from '../components/RepoItem';
import { useHistory } from 'react-router-dom';

const Tab1: React.FC = () => {
  const history = useHistory();

  const sampleRepos = [
    { id: 1, name: 'Repositorio 1', description: 'Repositorio de ejemplo', ownerAvatarUrl: 'https://avatars.githubusercontent.com/u/9919?s=64&v=4' },
    { id: 2, name: 'Repositorio 2', description: 'Otro repositorio de prueba', ownerAvatarUrl: 'https://avatars.githubusercontent.com/u/583231?s=64&v=4' },
    { id: 3, name: 'Repositorio 3', description: 'Proyecto Ionic demo', ownerAvatarUrl: 'https://avatars.githubusercontent.com/u/583231?s=64&v=4' },
  ];

  const stored = localStorage.getItem('repos');
  const repos = stored ? JSON.parse(stored) : sampleRepos;

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
