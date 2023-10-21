export default class AddForm {
  constructor() {
    this.init();

    this.addCard = this.addCard.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.getAllCards = this.getAllCards.bind(this);
    this.deleteCard = this.deleteCard.bind(this);

    document.addEventListener('DOMContentLoaded', async(ev) => {
      ev.preventDefault()
      fetch('http://localhost:7077?method=loadPage', {
        method: 'GET'
      })
    })

    this.form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const body = new FormData(this.form);
      try {
        const response = await fetch('http://localhost:7077?method=createTicket', {
          method: 'POST',
          body: body
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        this.addCard(data);
        this.closeForm();
      } catch (error) {
        console.error('Ошибка:', error);
      }
    });
  }

  init() {
    this.form = document.querySelector(".list-popup");
    this.addBtn = document.querySelector(".list-add");
    this.cardList = document.querySelector('.list');

    // document.querySelectorAll('action-delete').forEach(el => {
    //   el.addEventListener('click', (ev) => {
    //     ev.preventDefault();


    //     const body = Array.from(this.form.elements)
    //     .filter(({ name }) => name)
    //     .map(({name, value}) => `${name}=${encodeURIComponent(value)}`)
    //     .join('&')
  
    //     const xhr = new XMLHttpRequest();
  
    //     xhr.onreadystatechange = function() {
    //       if (xhr.readyState  !== 4) return;
    //     }
  
    //     xhr.open('POST', 'http://localhost:7077')
  
    //     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    //     xhr.send(body)
    //   })
    // });
  
    this.addBtn.addEventListener("click", () => {
      this.showForm();
      this.clearForm();
    });

    this.form.querySelector(".popup-cancel").addEventListener("click", (ev) => {
      ev.preventDefault();
      this.closeForm();
    });
  }

  addCard(response) {
    const maket = document.createElement('div');
    maket.classList.add('card')
    maket.insertAdjacentHTML('beforeend', `<div class="card-info">
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
  `)


  // <div class="card-description">
  // </div>
  
    this.cardList.appendChild(maket);

    maket.querySelector('.action-delete').addEventListener('click', (ev) => {
      ev.preventDefault();
      this.deleteCard(maket.querySelector('.card-checkbox').id)
    })

    maket.addEventListener('click', async(ev) => {
      if (!ev.target.classList.contains('card-checkbox') && !ev.target.classList.contains('action')) {
        const card = await this.getCard(maket.querySelector('.card-checkbox').id);

        const cardDesc = maket.querySelector('.card-description')
        if (cardDesc === null) {
          maket.insertAdjacentHTML('beforeend', `<div class="card-description">${card.description}</div>`)
        } else {
          cardDesc.remove();
        }
      }
    })
  }

  async getCard(id) {
    return fetch(`http://localhost:7077?method=ticketById&id=${id}`, {
      method: 'GET'
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        console.log(`Request failed with error ${xhr.status}`)
      }
    })
    .then(data => {
      return data
    })
    .catch(error => {
      console.error(error);
      throw error; 
    });
  }

  async deleteCard(id) {
    try {
      await fetch(`http://localhost:7077?method=deleteById&id=${id}`, {
        method: 'GET'
      });

      const data = await this.getAllCards();
      this.update(data);
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }


  getAllCards() {
    return fetch(`http://localhost:7077?method=allTickets`, {
      method: 'GET'
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        console.log(`Request failed with error ${xhr.status}`)
      }
    })
    .then(data => {
      return data
    })
    .catch(error => {
      console.error(error);
      throw error; 
    });
  }

  update(list) {
    this.cardList.innerHTML = '';
    list.forEach(el => {
      this.addCard(el)
    });
  }

  addInputFields(elName, elValue) {
    this.form.querySelector(".popup-input-name").value = elName;
    this.form.querySelector(".popup-input-value").value = elValue;
  }

  showForm() {
    this.form.parentElement.classList.add("active");
    this.form.classList.add("active");
  }

  closeForm() {
    this.form.parentElement.classList.remove("active");
    this.form.classList.remove("active");
  }

  clearForm() {
    const inputName = this.form.querySelector(".popup-input-name");
    const inputValue = this.form.querySelector(".popup-input-description");
    inputName.value = "";
    inputValue.value = "";
  }
}
