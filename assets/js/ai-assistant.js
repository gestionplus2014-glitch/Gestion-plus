/* assets/js/ai-assistant.js */

document.addEventListener('DOMContentLoaded', () => {
  const chatBtn = document.getElementById('ai-chat-btn');
  const chatContainer = document.getElementById('ai-chat-container');
  const chatClose = document.getElementById('ai-chat-close');
  const chatForm = document.getElementById('ai-chat-input-form');
  const chatInput = document.getElementById('ai-chat-input');
  const chatMessages = document.getElementById('ai-chat-messages');
  const quickReplies = document.querySelectorAll('.ai-quick-reply');

  // --- Toggle Chat Box Visibility ---
  if (chatBtn && chatContainer) {
    chatBtn.addEventListener('click', () => {
      chatContainer.classList.toggle('open');
      if (chatContainer.classList.contains('open')) {
        chatInput.focus();
      }
    });
  }

  if (chatClose && chatContainer) {
    chatClose.addEventListener('click', () => {
      chatContainer.classList.remove('open');
    });
  }

  // --- Chat Bot Knowledge Base & Keywords ---
  const responses = {
    greetings: `Bonjour ! Je suis l'assistant virtuel de <strong>Gestion Plus</strong>. 🤖<br><br>
                Je peux répondre instantanément à vos questions sur nos tarifs, nos packs Odoo ERP ou nos prestations de design graphique. Que voulez-vous savoir ?`,
                
    formules: `Nos **Formules Globales (Packs tout-en-un)** sont idéales pour lancer ou structurer votre activité :<br><br>
               🚀 <strong>Starter (399 € HT)</strong> : Logo simple + carte de visite + flyer + configuration Odoo de base + assistance 1 mois.<br>
               💼 <strong>Business (649 € HT)</strong> : Site Web complet + logo premium (3 propositions) + carte de visite premium + installation Odoo Cloud + modules CRM, Ventes, Achats + assistance 3 mois.<br>
               ⭐ <strong>Enterprise (899 € HT)</strong> : Site Web E-commerce premium + logo premium + installation Odoo complète + configuration avancée (Stocks, RH, Projet) + maintenance continue.<br><br>
               ➡️ <em>Vous pouvez commander ces packs directement sur notre page de contact ou demander un devis personnalisé !</em>`,

    design: `Voici nos tarifs transparents de **Design Graphique & Branding (à la carte)** :<br><br>
             🎨 <strong>Logo Simple</strong> : 80 €<br>
             💎 <strong>Logo Premium</strong> (source vectorielle, 3 concepts) : 180 €<br>
             📄 <strong>Flyer publicitaire</strong> : 60 €<br>
             📇 <strong>Carte de visite</strong> : Simple face (40 €), Recto/Verso (60 €), Premium avec finitions complexes (90 €).<br><br>
             ➡️ <em>Tous ces éléments graphiques sont intégrés à vos documents Odoo si vous prenez nos packs !</em>`,

    web: `Nous développons des **sites internet vitrines et e-commerce** performants :<br><br>
          💻 <strong>Site Web Simple (Landing Page)</strong> : 80 € (idéal pour présenter une activité).<br>
          🌐 <strong>Site Web Standard (jusqu'à 5 pages)</strong> : 250 € (parfait pour les PME, optimisé Google).<br>
          ✨ <strong>Site Web Design / Premium (sur-mesure)</strong> : 600 € (animations avancées et graphisme exclusif).<br><br>
          ➡️ <em>Nos sites sont 100% responsives (adaptés aux mobiles) et rapides à charger.</em>`,

    odoo: `<strong>Odoo ERP</strong> est l'outil ultime pour centraliser votre PME. Voici nos services associés :<br><br>
           ⚙️ <strong>Installation & Config</strong> : 400 € (mise en place de 3 modules de base, sécurisation serveur).<br>
           🛠️ <strong>Développement sur-mesure</strong> : 35 € à 50 € / heure (programmation de modules et connexions API spécifiques).<br>
           🛡️ <strong>Maintenance & Support</strong> : 50 € à 150 € / mois (sauvegardes régulières, assistance prioritaire, correctifs).<br><br>
           Nous maîtrisons tous les modules d'Odoo : Ventes/CRM, Stocks/Inventaire, Achats, Ressources Humaines, Gestion de Projet et Facturation.`,

    contact: `Vous pouvez nous contacter directement par ces moyens :<br><br>
              📞 <strong>Téléphone</strong> : <a href="tel:+212770327290">+212 770 32 72 90</a><br>
              📧 <strong>E-mail</strong> : <a href="mailto:gestion.plus.2014@gmail.com">gestion.plus.2014@gmail.com</a><br>
              🕒 <strong>Disponibilité</strong> : Lundi au Vendredi, de 10h à 18h.<br>
              🌍 <strong>Zone d'intervention</strong> : Maroc, France et International (support à distance).<br><br>
              ➡️ <em>Nous répondons généralement en moins de 48 heures !</em>`,

    fallback: `Je n'ai pas bien compris votre question. 🧐<br><br>
               Vous pouvez me poser des questions sur nos **tarifs**, nos prestations de **design**, nos sites **web**, ou l'intégration d'**Odoo ERP**.<br><br>
               <em>Sinon, vous pouvez remplir directement le formulaire de contact sur cette page pour échanger avec notre équipe !</em>`
  };

  // --- Send Message Helper ---
  function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('ai-message', `ai-message-${type}`);
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('ai-message-bubble');
    bubbleDiv.innerHTML = content;
    
    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv);
    
    // Auto-scroll
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // --- Show Typing Indicator ---
  function showTypingIndicator() {
    const indicatorDiv = document.createElement('div');
    indicatorDiv.classList.add('ai-message', 'ai-message-received', 'ai-temp-indicator');
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('ai-message-bubble', 'ai-typing-indicator');
    bubbleDiv.innerHTML = '<span></span><span></span><span></span>';
    
    indicatorDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(indicatorDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = chatMessages.querySelector('.ai-temp-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // --- Answer Matching Algorithm ---
  function getResponse(inputText) {
    const text = inputText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // strip accents
    
    if (text.includes('bonjour') || text.includes('salut') || text.includes('hello') || text.includes('coucou')) {
      return responses.greetings;
    }
    if (text.includes('formule') || text.includes('tarif') || text.includes('prix') || text.includes('combien') || text.includes('coute') || text.includes('pack')) {
      if (text.includes('design') || text.includes('logo') || text.includes('flyer') || text.includes('carte')) {
        return responses.design;
      }
      if (text.includes('web') || text.includes('site') || text.includes('vitrine') || text.includes('internet')) {
        return responses.web;
      }
      if (text.includes('odoo') || text.includes('erp') || text.includes('maintenance')) {
        return responses.odoo;
      }
      return responses.formules;
    }
    if (text.includes('design') || text.includes('logo') || text.includes('flyer') || text.includes('carte') || text.includes('identité') || text.includes('branding')) {
      return responses.design;
    }
    if (text.includes('web') || text.includes('site') || text.includes('vitrine') || text.includes('internet') || text.includes('e-commerce') || text.includes('page')) {
      return responses.web;
    }
    if (text.includes('odoo') || text.includes('erp') || text.includes('config') || text.includes('installation') || text.includes('maintenance') || text.includes('support')) {
      return responses.odoo;
    }
    if (text.includes('contact') || text.includes('mail') || text.includes('telephone') || text.includes('tel') || text.includes('adresse') || text.includes('zone') || text.includes('horaire') || text.includes('dispo') || text.includes('repondre') || text.includes('reponse') || text.includes('email')) {
      return responses.contact;
    }
    if (text.includes('merci') || text.includes('parfait') || text.includes('super') || text.includes('cool')) {
      return `Avec plaisir ! N'hésitez pas si vous avez d'autres questions. 😊`;
    }
    
    return responses.fallback;
  }

  // --- Simulate Bot Response ---
  function handleBotReply(userInput) {
    showTypingIndicator();
    
    const replyDelay = Math.random() * 500 + 800; // randomized delay between 800ms and 1300ms
    
    setTimeout(() => {
      removeTypingIndicator();
      const answer = getResponse(userInput);
      addMessage(answer, 'received');
    }, replyDelay);
  }

  // --- Submit Question Event ---
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const question = chatInput.value.trim();
      if (!question) return;

      // Add user message to window
      addMessage(question, 'sent');
      chatInput.value = '';

      // Get bot reply
      handleBotReply(question);
    });
  }

  // --- Quick Replies Click Event ---
  quickReplies.forEach(btn => {
    btn.addEventListener('click', function() {
      const questionText = this.textContent;
      const questionKey = this.getAttribute('data-question');
      
      // Add user message
      addMessage(questionText, 'sent');
      
      // Show typing indicator
      showTypingIndicator();
      
      setTimeout(() => {
        removeTypingIndicator();
        let reply = '';
        if (questionKey === 'formules') reply = responses.formules;
        else if (questionKey === 'design') reply = responses.design;
        else if (questionKey === 'odoo') reply = responses.odoo;
        else if (questionKey === 'contact') reply = responses.contact;
        else reply = responses.fallback;
        
        addMessage(reply, 'received');
      }, 1000);
    });
  });

  // --- WhatsApp Toggle Logic ---
  const waChatBtn = document.getElementById('wa-chat-btn');
  const waProfileContainer = document.getElementById('wa-profile-container');
  const waProfileClose = document.getElementById('wa-profile-close');

  if (waChatBtn && waProfileContainer) {
    waChatBtn.addEventListener('click', () => {
      // Close AI Chat box if open
      if (chatContainer && chatContainer.classList.contains('open')) {
        chatContainer.classList.remove('open');
      }
      waProfileContainer.classList.toggle('open');
    });
  }

  if (waProfileClose && waProfileContainer) {
    waProfileClose.addEventListener('click', () => {
      waProfileContainer.classList.remove('open');
    });
  }

  // Also close WhatsApp profile if AI Chat button is clicked
  if (chatBtn && waProfileContainer) {
    chatBtn.addEventListener('click', () => {
      if (waProfileContainer.classList.contains('open')) {
        waProfileContainer.classList.remove('open');
      }
    });
  }
});
