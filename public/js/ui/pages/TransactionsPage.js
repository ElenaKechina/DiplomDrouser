/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Пустой элемент страницы');
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      const { target } = event;

      if (
        !target.closest('.remove-account') &&
        !target.closest('.transaction__remove')
      ) {
        return;
      }

      if (target.closest('.remove-account')) {
        this.removeAccount();
      } else {
        this.removeTransaction(
          target.closest('.transaction__remove').dataset.id
        );
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions || Object.keys(this.lastOptions).length === 0) {
      return;
    }

    const isRemove = confirm('Вы действительно хотите удалить счёт?');

    if (!isRemove) {
      return;
    }

    Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
      if (response) {
        this.clear();
        App.updateWidgets();
      }
    });
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    const isRemove = confirm('Вы действительно хотите удалить транзакцию?');

    if (!isRemove) {
      return;
    }

    Transaction.remove({ id }, (err, response) => {
      if (response) {
        App.update();
      }
    });
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    const id = options?.account_id;

    if (!id) {
      return;
    }

    this.lastOptions = options;

    Account.get(id, (err, response) => {
      this.renderTitle(response.data.name);
    });

    Transaction.list(options, (err, response) => {
      if (response) {
        this.renderTransactions(response.data);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счета');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    this.element.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const time = new Date(date);
    const months = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];

    let day = time.getDate();
    const month = time.getMonth();
    const year = time.getFullYear();
    let hours = time.getHours();
    let minutes = time.getMinutes();

    day = day < 10 ? '0' + day : day;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${day} ${months[month]} ${year} г. в ${hours}:${minutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML({ created_at, id, name, sum, type }) {
    return `
		<!-- либо transaction_expense, либо transaction_income -->
		<div class="transaction ${
      type === 'expense' ? 'transaction_expense' : 'transaction_income'
    } row">
				<div class="col-md-7 transaction__details">
					<div class="transaction__icon">
							<span class="fa fa-money fa-2x"></span>
					</div>
					<div class="transaction__info">
							<h4 class="transaction__title">${name}</h4>
							<!-- дата -->
							<div class="transaction__date">${this.formatDate(created_at)}</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="transaction__summ">
					<!--  сумма -->
							${sum} <span class="currency">₽</span>
					</div>
				</div>
				<div class="col-md-2 transaction__controls">
						<!-- в data-id нужно поместить id -->
						<button class="btn btn-danger transaction__remove" data-id="${id}">
								<i class="fa fa-trash"></i>  
						</button>
				</div>
		</div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    let transactions = '';
    data.forEach((elem) => {
      transactions += this.getTransactionHTML(elem);
    });
    this.element.querySelector('.content').innerHTML = transactions;
  }
}
