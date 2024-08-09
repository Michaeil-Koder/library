'use strict';

const userInfoBtn = document.querySelector('.user-info');

const dashboardForm = document.querySelector('.dashboard-form');

const adminPanelBtn = document.querySelector('.admin-panel');

const adminPanel = document.querySelector('.admin-panel-funcs');

const addBookBtn = document.querySelector('.add-book');

const bookInfo = document.querySelector('.book-info');

const closeBookInfoBtn = document.querySelector('.close-btn');


const closeErrorBtn = document.querySelector('.btn_understand');
const error = document.querySelector('.errorClass');

const fResponse = document.querySelector('.func-responses');

const openUserInfo = function () {
  dashboardForm.classList.remove('hidden');
  adminPanel.classList.add('hidden');
};

const openAdminPanel = function () {
  dashboardForm.classList.add('hidden');
  adminPanel.classList.remove('hidden');
};

const openBookForm = function () {
  bookInfo.classList.remove('hidden');
};

const closeBookInfo = function () {
  bookInfo.classList.add('hidden');
  // adminPanel.classList.remove('hidden');
};
const closeError = function () {
  error.classList.add('hidden');
};

userInfoBtn.addEventListener('click', openUserInfo);

adminPanelBtn.addEventListener('click', openAdminPanel);

addBookBtn?.addEventListener('click', openBookForm);

closeBookInfoBtn.addEventListener('click', closeBookInfo);

closeErrorBtn.addEventListener('click', closeError);