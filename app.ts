import './src/styles.css';
import validator from 'validator';

const urlInput = document.getElementById('urlInput') as HTMLInputElement;
const urlForm = document.getElementById('urlForm') as HTMLFormElement;
const messageDiv = document.getElementById('message') as HTMLDivElement;
const submitButton = urlForm.querySelector('button') as HTMLButtonElement;

function validateURL(url: string): boolean {
  return validator.isURL(url);
}

function setMessage(text: string, type?: 'success' | 'error') {
  messageDiv.textContent = text;
  if (type === 'success') {
    messageDiv.classList.remove('text-red-500');
    messageDiv.classList.add('text-green-500');
  } else if (type === 'error') {
    messageDiv.classList.remove('text-green-500');
    messageDiv.classList.add('text-red-500');
  } else {
    messageDiv.classList.remove('text-red-500', 'text-green-500');
  }
}

urlInput.addEventListener('input', () => {
  const url = urlInput.value;
  if (validateURL(url)) {
    urlInput.classList.remove('border-red-500');
    urlInput.classList.add('border-green-500');

    setMessage('Looking good', 'success');
    submitButton.disabled = false;
  } else {
    urlInput.classList.remove('border-green-500');
    urlInput.classList.add('border-red-500');

    setMessage('URL is wonky', 'error');
    submitButton.disabled = true;
  }
});

urlForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const url = urlInput.value;
  if (validateURL(url)) {
    mockBackendCall(url);
  } else {
    setMessage('Sneaky, but no', 'error');
  }
});

function mockBackendCall(url: string) {
  fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',
    body: JSON.stringify({ url }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Server says:', data);

      const isDocument: boolean = Math.random() < 0.5;

      if (isDocument) {
        setMessage('URL submitted, it is a File!', 'success');
      } else {
        setMessage('URL submitted, it is a Directory!', 'success');
      }

      urlInput.value = '';
      urlInput.classList.remove('border-green-500');
      submitButton.disabled = true;
    })
    .catch((error) => {
      console.error('Error:', error);
      setMessage('Error submitting URL', 'error');
    });
}
