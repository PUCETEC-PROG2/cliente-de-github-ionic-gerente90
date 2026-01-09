import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonThumbnail,
} from '@ionic/react';
import { createOutline, trash } from 'ionicons/icons';

import './RepoItem.css';
import { RepositoryItem } from '../interfaces/RepositoryItem';

type Repo = {
  id?: string | number;
  name: string;
  description?: string | null;
  ownerAvatarUrl?: string | null;
  owner?: string | null;
  language?: string | null;
  imageUrl?: string | null;
};

type SlidingElement = HTMLElement & { close?: () => void };

type Props = {
  repos?: (Repo | RepositoryItem)[];
  onSelect?: (repo: Repo | RepositoryItem) => void;
  onEdit?: (repo: Repo | RepositoryItem) => void;
  onDelete?: (repo: Repo | RepositoryItem) => void;
  title?: string;
  subtitle?: string;
};

const RepoList: React.FC<Props> = ({
  repos = [],
  onSelect,
  onEdit,
  onDelete,
  title = 'Repositorios',
  subtitle = '',
}) => {
  const hasActions = Boolean(onEdit || onDelete);

  const handleOptionClick = (
    event: React.MouseEvent<HTMLIonItemOptionElement>,
    callback?: (repo: Repo | RepositoryItem) => void,
    repo?: Repo | RepositoryItem
  ) => {
    event.stopPropagation();
    const sliding = event.currentTarget.closest('ion-item-sliding') as SlidingElement | null;
    sliding?.close?.();
    callback && repo && callback(repo);
  };

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
            repos.map((repo) => {
              const item = (
                <IonItem
                  button={Boolean(onSelect)}
                  detail={Boolean(onSelect)}
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
              );

              if (!hasActions) {
                return (
                  <React.Fragment key={repo.id}>
                    {item}
                  </React.Fragment>
                );
              }

              return (
                <IonItemSliding key={repo.id}>
                  {item}
                  <IonItemOptions side="end">
                    {onEdit ? (
                      <IonItemOption
                        color="tertiary"
                        onClick={(event) => handleOptionClick(event, onEdit, repo)}
                      >
                        <IonIcon slot="start" icon={createOutline} />
                        Editar
                      </IonItemOption>
                    ) : null}
                    {onDelete ? (
                      <IonItemOption
                        color="danger"
                        onClick={(event) => handleOptionClick(event, onDelete, repo)}
                      >
                        <IonIcon slot="start" icon={trash} />
                        Borrar
                      </IonItemOption>
                    ) : null}
                  </IonItemOptions>
                </IonItemSliding>
              );
            })
          )}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default RepoList;
