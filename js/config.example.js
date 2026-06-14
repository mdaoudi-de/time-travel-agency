/* ============================================================
   TimeTravel Agency — config.example.js (MODÈLE, sans secret)

   Pour activer l'IA Mistral :
   1. Copiez ce fichier en `js/config.local.js`
   2. Remplacez la valeur de `mistralKey` par votre clé (console.mistral.ai)

   `config.local.js` est ignoré par git : votre clé ne sera jamais poussée.
   Sans clé, l'application fonctionne en « mode local » (réponses hors-ligne).
   ============================================================ */
window.TT_CONFIG = {
  mistralKey: '' // ex. : 'aBcD1234...'
};
