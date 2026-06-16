/* assets/js/contact.js */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const successMessage = document.getElementById('form-success');
  const subjectSelect = document.getElementById('form-subject');
  const formulaWrapper = document.getElementById('formula-select-wrapper');
  const formulaSelect = document.getElementById('form-formula');
  const resetSuccessBtn = document.getElementById('reset-success-btn');

  // --- Dynamic formula dropdown visibility ---
  function checkSubjectVisibility() {
    if (subjectSelect.value === 'devis' || subjectSelect.value === 'offre-carte' || subjectSelect.value === 'odoo' || subjectSelect.value === 'design') {
      formulaWrapper.style.display = 'block';
    } else {
      formulaWrapper.style.display = 'none';
      formulaSelect.value = 'aucune'; // Reset formula
    }
  }

  subjectSelect.addEventListener('change', checkSubjectVisibility);

  // --- Parse URL parameters to pre-fill the form ---
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type') || urlParams.get('subject');
  const formulaParam = urlParams.get('formula');

  // Pre-fill subject if provided
  if (typeParam === 'devis') {
    subjectSelect.value = 'devis';
    checkSubjectVisibility();
  } else if (typeParam === 'offre-carte') {
    subjectSelect.value = 'offre-carte';
    checkSubjectVisibility();
  } else if (typeParam === 'odoo') {
    subjectSelect.value = 'odoo';
    checkSubjectVisibility();
  } else if (typeParam === 'design') {
    subjectSelect.value = 'design';
    checkSubjectVisibility();
  }

  // Pre-fill formula if provided
  if (formulaParam) {
    const isPack = ['starter', 'business', 'enterprise'].includes(formulaParam);
    const isALaCarte = [
      'logo-simple', 'logo-premium', 'flyer', 'carte-simple', 'carte-double', 'carte-premium',
      'web-simple', 'web-standard', 'web-premium',
      'odoo-config', 'odoo-dev', 'odoo-maint'
    ].includes(formulaParam);

    if (isPack) {
      subjectSelect.value = 'devis';
    } else if (isALaCarte) {
      subjectSelect.value = 'offre-carte';
    } else if (formulaParam === 'custom') {
      subjectSelect.value = 'devis';
    }
    
    checkSubjectVisibility();
    
    // Validate if the option actually exists in the select dropdown
    const options = Array.from(formulaSelect.options).map(opt => opt.value);
    if (options.includes(formulaParam)) {
      formulaSelect.value = formulaParam;
    }
  }

  // --- Form Submission with FormSubmit.co AJAX ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple HTML5 validation check
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      
      const submitBtn = document.getElementById('submit-form-btn');
      const originalBtnContent = submitBtn.innerHTML;
      
      // Loading State
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Envoi en cours...';
      
      // Collect form values
      const formData = {
        access_key: "434f8ead-4614-4a0c-a8ac-d8b5e3193683",
        name: document.getElementById('form-name').value,
        email: document.getElementById('form-email').value,
        phone: document.getElementById('form-phone').value || "Non spécifié",
        company: document.getElementById('form-company').value || "Non spécifié",
        subject: document.getElementById('form-subject').value,
        formula: document.getElementById('form-formula').value || "Aucune",
        message: document.getElementById('form-message').value
      };
      
      // Submit form data using fetch to Web3Forms
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 200 || data.success) {
          // Reset button
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnContent;
          
          // Hide Form, Show Success Card
          contactForm.style.display = 'none';
          successMessage.style.display = 'block';
          
          // Scroll to success message
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          // Display the exact message returned by Web3Forms
          alert("Erreur de validation Web3Forms : " + (data.message || "Veuillez vérifier vos paramètres."));
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnContent;
        }
      })
      .catch(error => {
        alert("Une erreur réseau est survenue lors de l'envoi : " + error.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      });
    });
  }

  // --- Reset Form to send another message ---
  if (resetSuccessBtn) {
    resetSuccessBtn.addEventListener('click', () => {
      contactForm.reset();
      formulaWrapper.style.display = 'none';
      
      successMessage.style.display = 'none';
      contactForm.style.display = 'block';
    });
  }
});
