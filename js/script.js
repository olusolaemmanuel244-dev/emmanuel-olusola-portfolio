// Shared navigation and footer
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Academic planner: array data, DOM updates and localStorage persistence.
  const taskForm = document.getElementById('task-form');
  if (taskForm) {
    const input = document.getElementById('task-input');
    const dateInput = document.getElementById('task-date');
    const list = document.getElementById('task-list');
    const empty = document.getElementById('empty-state');
    const total = document.getElementById('total-count');
    const done = document.getElementById('done-count');
    const pending = document.getElementById('pending-count');
    const clearButton = document.getElementById('clear-completed');
    let tasks = JSON.parse(localStorage.getItem('emmanuelAcademicTasks') || '[]');

    function saveTasks() {
      localStorage.setItem('emmanuelAcademicTasks', JSON.stringify(tasks));
    }
    function renderTasks() {
      list.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', 'Mark task completed');
        checkbox.addEventListener('change', () => {
          task.completed = checkbox.checked; saveTasks(); renderTasks();
        });
        const textWrap = document.createElement('div');
        textWrap.className = 'task-text' + (task.completed ? ' done' : '');
        textWrap.append(document.createTextNode(task.title));
        if (task.date) {
          const date = document.createElement('small');
          date.className = 'task-date'; date.textContent = 'Due: ' + task.date;
          textWrap.appendChild(date);
        }
        const remove = document.createElement('button');
        remove.className = 'delete-task'; remove.type = 'button'; remove.textContent = 'Delete';
        remove.addEventListener('click', () => {
          tasks = tasks.filter(item => item.id !== task.id); saveTasks(); renderTasks();
        });
        li.append(checkbox, textWrap, remove); list.appendChild(li);
      });
      const completed = tasks.filter(task => task.completed).length;
      total.textContent = tasks.length; done.textContent = completed;
      pending.textContent = tasks.length - completed;
      empty.hidden = tasks.length > 0;
    }
    taskForm.addEventListener('submit', event => {
      event.preventDefault();
      const title = input.value.trim();
      if (!title) { input.focus(); return; }
      tasks.unshift({id: Date.now(), title, date: dateInput.value, completed: false});
      saveTasks(); renderTasks(); taskForm.reset(); input.focus();
    });
    clearButton.addEventListener('click', () => {
      tasks = tasks.filter(task => !task.completed); saveTasks(); renderTasks();
    });
    renderTasks();
  }

  // Client-side contact form validation. This demo does not send data to a server.
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      const feedback = document.getElementById('form-feedback');
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const phoneValid = /^\d+$/.test(phone);
      if (![name, email, phone, subject, message].every(Boolean)) {
        feedback.textContent = 'Please complete every field.'; feedback.className = 'form-feedback error'; return;
      }
      if (!emailValid) {
        feedback.textContent = 'Please enter a valid email address.'; feedback.className = 'form-feedback error'; return;
      }
      if (!phoneValid) {
        feedback.textContent = 'Phone number must contain digits only.'; feedback.className = 'form-feedback error'; return;
      }
      feedback.textContent = 'Thank you! The form passed validation. This demonstration does not send messages to a server.';
      feedback.className = 'form-feedback success'; contactForm.reset();
    });
  }
});
