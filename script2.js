const GEMINI_API_KEY = "AIzaSyA_6kb_udqs0c3ADNbHcVnaQj4y6STy0G8";

function callGeminiAPI(prompt) {
    sendButton.disabled = true;
    sendButton.innerHTML = 'Chargement...';
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
          contents: [{ 
              parts: [{ 
                  text: 
                  `Réponds à la question suivante uniquement en texte. Voilà ma question : ${prompt}` 
              }] 
          }] 
      })
    })
      .then(res => res.json())
      .then((result) => {
          const textContent = result.candidates[0]?.content?.parts?.[0]?.text?.replace(/```|html/g, '').trim()
          console.log('result : ', result, textContent)
          displayMessage(textContent, true);
          sendButton.disabled = false;
          sendButton.innerHTML = 'Envoyer';
  
      })
      .catch((error) => console.error(error));
  }
