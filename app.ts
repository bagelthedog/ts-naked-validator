import './src/styles.css';
import validator from 'validator';

const urlInput = document.getElementById('urlInput') as HTMLInputElement;
const urlForm = document.getElementById('urlForm') as HTMLFormElement;
const messageDiv = document.getElementById('message') as HTMLDivElement;
const submitButton = urlForm.querySelector('button') as HTMLButtonElement;

// validator package is highly configurable, so lets use it here instead of regex or similar
// in this case, since requirements aren't known, lets use the default validation
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

// The assumption here is that the user-provided URL would be
// sent to a backend, which would in turn perform the necessary operation
// and check if the URL is a directory listing or a file (or any other condition)
// second assumption that the backend would come back with JSON payload with keys something like:
// { "URLexists": "true", "isDirectory": "false" } or similar.
// The front end would parse these values and notify the user of the result.
// In this scenario, we're just pinging real, known-safe remote (for async op), but are generating
// a radom 50/50 chance of it 'being a directory' or not, and notifying the user of this "result"
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
