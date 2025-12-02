import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonTextarea, IonButton, IonToast } from '@ionic/react';
import './Tab2.css';
import { useHistory } from 'react-router-dom';

const Tab2: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

  const handleSubmit = () => {
    if (!name.trim()) {
      setShowToast(true);
      return;
    }

    const stored = localStorage.getItem('repos');
    const repos = stored ? JSON.parse(stored) : [];
    const newRepo = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      ownerAvatarUrl: undefined,
    };
    repos.unshift(newRepo);
    localStorage.setItem('repos', JSON.stringify(repos));

    // Navegar a la lista de repositorios
    history.push('/tab1');
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

        <div className="form-container">
          <IonInput
            className="form-field"
            label="Nombre del repositorio"
            labelPlacement="floating"
            fill="outline"
            placeholder="android-project"
            value={name}
            onIonChange={e => setName((e.target as any).value)}
          ></IonInput>

          <IonTextarea
            className="form-field"
            label="Descripción del repositorio"
            labelPlacement="floating"
            fill="outline"
            placeholder="Descripción del repositorio"
            rows={6}
            value={description}
            onIonChange={e => setDescription((e.target as any).value)}
          ></IonTextarea>

          <IonButton expand="block" className="form-button" onClick={handleSubmit}>Guardar</IonButton>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="El nombre del repositorio es obligatorio"
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
