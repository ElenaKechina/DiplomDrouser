/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sidebarBtn = document.querySelector('.sidebar-toggle');

    sidebarBtn.addEventListener('click', (event) => {
      event.preventDefault();
      document.body.classList.toggle('sidebar-open');
      document.body.classList.toggle('sidebar-collapse');
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const sidebar = document.querySelector('.sidebar-menu');

    sidebar.addEventListener('click', (event) => {
      const { target } = event;
      if (!target.closest('.menu-item')) {
        return;
      }

      event.preventDefault();
      if (target.closest('.menu-item_login')) {
        App.getModal('login').open();
      } else if (target.closest('.menu-item_register')) {
        App.getModal('register').open();
      } else if (target.closest('.menu-item_logout')) {
        User.logout((error, response) => {
          if (response) {
            App.setState('init');
          }
        });
      } else {
        return;
      }
    });
  }
}
