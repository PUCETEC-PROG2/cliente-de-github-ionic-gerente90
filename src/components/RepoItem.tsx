import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
} from '@ionic/react';

import './RepoItem.css';

type Repo = {
  id: string | number;
  name: string;
  description?: string;
  ownerAvatarUrl?: string;
};

type Props = {
  repos?: Repo[];
  onSelect?: (repo: Repo) => void;
  title?: string;
  subtitle?: string;
};

const RepoList: React.FC<Props> = ({ repos = [], onSelect, title = 'Repositorios', subtitle = '' }) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
        {subtitle ? <IonCardSubtitle>{subtitle}</IonCardSubtitle> : null}
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          {repos.length === 0 ? (
            <IonItem lines="none">
              <IonLabel>No hay repositorios</IonLabel>
            </IonItem>
          ) : (
            repos.map((repo) => (
              <IonItem
                key={repo.id}
                button
                onClick={() => onSelect && onSelect(repo)}
              >
                <IonThumbnail slot="start">
                  <img
                    alt={`${repo.name} avatar`}
                    src={repo.ownerAvatarUrl ?? '/assets/default-avatar.png'}
                  />
                </IonThumbnail>
                <IonLabel className="repo-label">
                  <h2>{repo.name}</h2>
                  {repo.description ? <p>{repo.description}</p> : null}
                </IonLabel>
              </IonItem>
            ))
          )}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default RepoList;