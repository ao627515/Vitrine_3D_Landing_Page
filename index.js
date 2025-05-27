// État global pour le modal
let currentModel = null;

// Fonction pour ouvrir le modal avec un modèle spécifique
function openModal(modelId, title, description) {
  currentModel = modelId;

  const modal = document.getElementById('modelModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalIframe = document.getElementById('modalIframe');

  // Mise à jour des contenus
  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalIframe.src = `models/${modelId}/index.html`;

  // Affichage du modal avec animation
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Empêcher le scroll

  // Analytics/tracking (optionnel)
  console.log(`Model opened: ${modelId}`);
}

// Fonction pour fermer le modal
function closeModal() {
  const modal = document.getElementById('modelModal');
  const modalIframe = document.getElementById('modalIframe');

  modal.classList.remove('active');
  document.body.style.overflow = ''; // Restaurer le scroll

  // Nettoyage de l'iframe pour économiser les ressources
  setTimeout(() => {
    modalIframe.src = '';
  }, 300);

  currentModel = null;
}

// Fonctions de contrôle du modèle 3D
function setViewMode(mode) {
  const buttons = document.querySelectorAll('.control-group:first-child .control-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Communication avec l'iframe du modèle 3D
  sendMessageToModel({ action: 'setViewMode', mode: mode });
  console.log(`View mode changed to: ${mode}`);
}

function setLighting(lightingType) {
  const buttons = document.querySelectorAll('.control-group:nth-child(2) .control-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  sendMessageToModel({ action: 'setLighting', type: lightingType });
  console.log(`Lighting changed to: ${lightingType}`);
}

function setView(viewType) {
  sendMessageToModel({ action: 'setView', view: viewType });
  console.log(`View changed to: ${viewType}`);
}

// Fonction pour communiquer avec l'iframe du modèle 3D
function sendMessageToModel(message) {
  const iframe = document.getElementById('modalIframe');
  if (iframe && iframe.contentWindow) {
    try {
      iframe.contentWindow.postMessage(message, '*');
    } catch (error) {
      console.log('Communication avec le modèle 3D:', message);
    }
  }
}

// Gestion des événements clavier
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && currentModel) {
    closeModal();
  }
});

// Fermeture du modal en cliquant sur l'overlay
document.getElementById('modelModal').addEventListener('click', function (event) {
  if (event.target === this) {
    closeModal();
  }
});

// Écoute des messages provenant des modèles 3D (optionnel)
window.addEventListener('message', function (event) {
  // Ici vous pouvez gérer les retours des modèles 3D
  // Par exemple: changement de vue, chargement terminé, etc.
  if (event.data && event.data.source === '3d-model') {
    console.log('Message from 3D model:', event.data);
  }
});

// Préchargement des modèles au survol (optionnel, pour de meilleures performances)
document.addEventListener('DOMContentLoaded', function () {
  const modelCards = document.querySelectorAll('.model-card');

  modelCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      // Effet visuel supplémentaire au survol
      this.style.transform = 'translateY(-4px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });
});