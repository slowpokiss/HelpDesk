/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/classes/addForm.js
class AddForm {
  constructor() {
    this.init();
    this.addCard = this.addCard.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.getAllCards = this.getAllCards.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    document.addEventListener("DOMContentLoaded", async ev => {
      ev.preventDefault();
      fetch("http://localhost:7077?method=loadPage", {
        method: "GET"
      });
    });
    this.form.addEventListener("submit", async ev => {
      ev.preventDefault();
      const body = new FormData(this.form);
      try {
        const response = await fetch("http://localhost:7077?method=createTicket", {
          method: "POST",
          body: body
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        this.addCard(data);
        this.closeForm(this.form);
      } catch (error) {
        console.error("Ошибка:", error);
      }
    });
  }
  init() {
    this.form = document.querySelector(".list-popup");
    this.delForm = document.querySelector(".del-form");
    this.editForm = document.querySelector(".edit-form");
    this.addBtn = document.querySelector(".list-add");
    this.cardList = document.querySelector(".list");
    this.addBtn.addEventListener("click", () => {
      this.clearForm(this.form);
      this.showForm(this.form);
    });
    this.form.querySelector(".popup-cancel").addEventListener("click", ev => {
      ev.preventDefault();
      this.closeForm(this.form);
    });
    this.editForm.querySelector(".popup-cancel").addEventListener("click", ev => {
      ev.preventDefault();
      this.closeForm(this.editForm);
    });
  }
  addCard(response) {
    const maket = document.createElement("div");
    maket.classList.add("card");
    maket.insertAdjacentHTML("beforeend", `<div class="card-info">
    <div class="card-info-state">
      <input type="checkbox" name="card-state" id="${response.id}" class="card-checkbox">
      <label for="${response.id}"></label>
      <div class="card-title">${response.name}</div>
    </div>

    <div class="card-info-state">
      <div class="card-date">${response.created}</div>
      <div class="card-actions">
        <div class="action action-edit"></div>
        <div class="action action-delete"></div>
      </div>
    </div>
  </div>
  `);
    this.cardList.appendChild(maket);
    document.getElementById(response.id).checked = response.status;
    maket.querySelector(".card-checkbox").addEventListener("change", async ev => {
      ev.preventDefault();
      const state = maket.querySelector(".card-checkbox").checked;
      const id = maket.querySelector(".card-checkbox").id;
      try {
        await fetch(`http://localhost:7077?method=changeStateById&id=${id}`, {
          method: "POST",
          body: state
        });
      } catch (err) {
        console.log(err);
      }
    });
    maket.querySelector(".action-edit").addEventListener("click", async ev => {
      ev.preventDefault();
      this.clearForm(this.editForm);
      const card = await this.getCard(maket.querySelector(".card-checkbox").id);
      this.addInputFields(card.name, card.description, this.editForm);
      this.showForm(this.editForm);
      this.editCard(card.id);
    });
    maket.querySelector(".action-delete").addEventListener("click", ev => {
      ev.preventDefault();
      this.showForm(this.delForm);
      this.delForm.querySelector(".popup-save").addEventListener("click", ev => {
        ev.preventDefault();
        this.deleteCard(maket.querySelector(".card-checkbox").id);
        this.closeForm(this.delForm);
      });
      this.delForm.querySelector(".popup-cancel").addEventListener("click", ev => {
        ev.preventDefault();
        this.closeForm(this.delForm);
      });
    });
    maket.addEventListener("click", async ev => {
      if (!ev.target.classList.contains("card-checkbox") && !ev.target.classList.contains("action") && ev.target.tagName !== "LABEL" && ev.target.tagName !== "INPUT") {
        const card = await this.getCard(maket.querySelector(".card-checkbox").id);
        const cardDesc = maket.querySelector(".card-description");
        if (cardDesc === null) {
          maket.insertAdjacentHTML("beforeend", `<div class="card-description">${card.description}</div>`);
        } else {
          cardDesc.remove();
        }
      }
    });
  }
  async getCard(id) {
    return fetch(`http://localhost:7077?method=ticketById&id=${id}`, {
      method: "GET"
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(`Request failed with error ${response.status}`);
      }
    }).then(data => {
      return data;
    }).catch(error => {
      console.error(error);
      throw error;
    });
  }
  async deleteCard(id) {
    try {
      await fetch(`http://localhost:7077?method=deleteById&id=${id}`, {
        method: "GET"
      });
      const data = await this.getAllCards();
      this.update(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  editCard(id) {
    this.editForm.onsubmit = async ev => {
      ev.preventDefault();
      const body = new FormData(this.editForm);
      try {
        await fetch(`http://localhost:7077?method=editById&id=${id}`, {
          method: "POST",
          body: body
        });
        const data = await this.getAllCards();
        this.update(data);
        this.closeForm(this.editForm);
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
  }
  getAllCards() {
    return fetch(`http://localhost:7077?method=allTickets`, {
      method: "GET"
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(`Request failed with error ${response.status}`);
      }
    }).then(data => {
      return data;
    }).catch(error => {
      console.error(error);
      throw error;
    });
  }
  update(list) {
    this.cardList.innerHTML = "";
    list.forEach(el => {
      this.addCard(el);
    });
  }
  addInputFields(elName, elValue, form) {
    form.querySelector(".popup-input-name").value = elName;
    form.querySelector(".popup-input-description").value = elValue;
  }
  showForm(form) {
    form.parentElement.classList.add("active");
    form.classList.add("active");
  }
  closeForm(form) {
    form.parentElement.classList.remove("active");
    form.classList.remove("active");
  }
  clearForm(form) {
    const inputName = form.querySelector(".popup-input-name");
    const inputValue = form.querySelector(".popup-input-description");
    inputName.value = "";
    inputValue.value = "";
  }
}
;// CONCATENATED MODULE: ./src/js/app.js

const b = new AddForm();
;// CONCATENATED MODULE: ./src/index.js


// TODO: write your code in app.js
/******/ })()
;