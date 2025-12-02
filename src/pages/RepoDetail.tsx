import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';

const RepoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  // Por ahora mostramos datos básicos usando el id. Más adelante puedes
  // recuperar los datos reales desde una API usando el id.
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
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Repositorio #{id}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Aquí puedes mostrar información del repositorio con ID <strong>{id}</strong>.</p>
            <p>Ejemplo: nombre, descripción, owner, estrellas, etc.</p>
            <IonButton expand="block" onClick={() => history.goBack()}>
              Volver
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default RepoDetail;
