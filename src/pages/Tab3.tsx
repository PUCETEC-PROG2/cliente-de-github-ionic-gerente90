import React from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import './Tab3.css';
import { fetchUserInfo } from '../services/GithubService';
import { UserInfo } from '../interfaces/UserInfo';

const Tab3: React.FC = () => {
  const [userInfo, setUserInfo] = React.useState<UserInfo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadUserProfile = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const user = await fetchUserInfo();

      if (user) {
        setUserInfo(user);
      } else {
        setUserInfo(null);
        setError('No se pudo obtener la información del usuario.');
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al consultar tu perfil.');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Usuario</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="user-container">
          {loading ? (
            <div className="user-loading">
              <IonSpinner name="dots" />
              <p>Cargando perfil...</p>
            </div>
          ) : error ? (
            <div className="user-error">
              <p>{error}</p>
              <IonButton size="small" onClick={loadUserProfile}>
                Reintentar
              </IonButton>
            </div>
          ) : userInfo ? (
            <div className="user-card">
              <div className="user-banner">
                <svg className="banner-icon" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 160 80 Q 180 60 200 40 L 200 0 L 0 0 L 0 40 Q 40 80 80 100 Q 120 120 160 80 Z" fill="#b0b8cc" />
                </svg>
              </div>
              <div className="user-info">
                <div className="user-avatar">
                  <img src={userInfo.avatarUrl} alt={userInfo.login} />
                </div>
                <p className="user-handle">@{userInfo.login}</p>
                <h2 className="user-name">{userInfo.name ?? userInfo.login}</h2>
                <p className="user-bio">{userInfo.bio ?? 'Sin biografía disponible.'}</p>

                <div className="user-stats">
                  <div>
                    <span>Repos</span>
                    <strong>{userInfo.publicRepos}</strong>
                  </div>
                  <div>
                    <span>Seguidores</span>
                    <strong>{userInfo.followers}</strong>
                  </div>
                  <div>
                    <span>Siguiendo</span>
                    <strong>{userInfo.following}</strong>
                  </div>
                </div>

                <div className="user-details">
                  {userInfo.location && <p>📍 {userInfo.location}</p>}
                  {userInfo.company && <p>🏢 {userInfo.company}</p>}
                  {userInfo.blog && (
                    <p>
                      🔗 <a href={userInfo.blog} target="_blank" rel="noopener noreferrer">{userInfo.blog}</a>
                    </p>
                  )}
                </div>

                <IonButton
                  expand="block"
                  href={userInfo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="user-link"
                >
                  Ver en GitHub
                </IonButton>
              </div>
            </div>
          ) : null}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
