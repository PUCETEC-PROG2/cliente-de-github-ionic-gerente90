import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { earth, gitBranchOutline, star, people, documentText, linkOutline } from 'ionicons/icons';
import './RepoDetail.css';
import { fetchRepositoryById, RepositoryDetail } from '../services/GithubService';

const RepoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [repo, setRepo] = React.useState<RepositoryDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadRepo = async () => {
      setLoading(true);
      setError(null);

      if (!id) {
        setError('Repositorio no encontrado.');
        setLoading(false);
        return;
      }

      const detail = await fetchRepositoryById(id);
      if (detail) {
        setRepo(detail);
      } else {
        setError('No pudimos encontrar la información de este repo.');
      }
      setLoading(false);
    };

    loadRepo();
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab1" />
          </IonButtons>
          <IonTitle>Detalle del repositorio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="repo-detail-content">
        {loading ? (
          <div className="repo-detail-loading">
            <IonSpinner name="dots" />
            <p>Cargando repositorio...</p>
          </div>
        ) : error ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Ups...</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{error}</p>
              <IonButton expand="block" onClick={() => history.goBack()}>
                Volver
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : repo ? (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardSubtitle>{repo.fullName}</IonCardSubtitle>
                <IonCardTitle>{repo.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{repo.description || 'Sin descripción disponible.'}</p>
                <IonButton
                  expand="block"
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver en GitHub
                </IonButton>
              </IonCardContent>
            </IonCard>

            <IonList inset>
              <IonItem>
                <IonIcon slot="start" icon={people} />
                <IonLabel>
                  <p>Owner</p>
                  <strong>{repo.owner}</strong>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon slot="start" icon={star} />
                <IonLabel>
                  <p>Estrellas</p>
                  <strong>{repo.stargazersCount ?? 0}</strong>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon slot="start" icon={documentText} />
                <IonLabel>
                  <p>Issues abiertas</p>
                  <strong>{repo.openIssuesCount ?? 0}</strong>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon slot="start" icon={gitBranchOutline} />
                <IonLabel>
                  <p>Branch por defecto</p>
                  <strong>{repo.defaultBranch}</strong>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon slot="start" icon={earth} />
                <IonLabel>
                  <p>Visibilidad</p>
                  <strong>{repo.visibility}</strong>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon slot="start" icon={linkOutline} />
                <IonLabel>
                  <p>ID</p>
                  <strong>{repo.id}</strong>
                </IonLabel>
              </IonItem>
            </IonList>

            <IonButton expand="block" fill="clear" onClick={() => history.goBack()}>
              Volver
            </IonButton>
          </>
        ) : null}
      </IonContent>
    </IonPage>
  );
};

export default RepoDetail;
