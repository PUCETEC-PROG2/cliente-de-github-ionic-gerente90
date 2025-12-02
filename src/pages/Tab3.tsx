import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab3.css';

const Tab3: React.FC = () => {
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
          <div className="user-card">
            <div className="user-banner">
              <svg className="banner-icon" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                <path d="M 160 80 Q 180 60 200 40 L 200 0 L 0 0 L 0 40 Q 40 80 80 100 Q 120 120 160 80 Z" fill="#b0b8cc" />
              </svg>
            </div>
            <div className="user-info">
              <div className="user-avatar">
                <img src="https://via.placeholder.com/80" alt="Avatar" />
              </div>
              <p className="user-handle">JEFFERSONALMEIDA</p>
              <h2 className="user-name">Jefferson Almeida</h2>
              <p className="user-bio">Este es el perfil de Jefferson Almeida</p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
