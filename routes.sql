-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Янв 29 2026 г., 02:34
-- Версия сервера: 5.7.35-38
-- Версия PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `cc61191_vz`
--

-- --------------------------------------------------------

--
-- Структура таблицы `routes`
--

CREATE TABLE IF NOT EXISTS `routes` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `alias` varchar(255) NOT NULL,
  `menu` varchar(255) NOT NULL DEFAULT 'link',
  `title` varchar(255) NOT NULL,
  `modules` text NOT NULL,
  `rule` varchar(255) NOT NULL DEFAULT 'default',
  `view` enum('yes','no') NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `routes`
--

INSERT INTO `routes` (`id`, `alias`, `menu`, `title`, `modules`, `rule`, `view`) VALUES
(1, 'index', 'главная', 'Главная', 'consent,auth,record', '0,1,2', 'yes'),
(2, 'opros', 'опрос', 'Опрос (в разработке)', '', '1,2', 'yes'),
(3, 'parser', 'парсер', 'парсер вк групп , поиск клиентов, сбор данных', '', '2', 'yes'),
(4, 'clients', 'клиенты', 'клиенты', '', '2', 'yes'),
(5, 'lk', 'личный кабинет', 'личный кабинет', 'auth,record,record-lite,opros,vk', '1,2', 'yes'),
(6, 'error', '', 'Страница недоступна - 404 ошибка', 'auth,record', '0,1,2', 'yes'),
(7, 'schedule', 'расписание', 'Расписание', 'auth,record', '2', 'yes'),
(9, 'settings', 'настройки', 'настройки системы', 'auth,record', '2', 'yes'),
(10, 'map', 'карта', 'карта', 'auth,record', '2', 'yes'),
(11, 'iwant', 'заявка', 'оформление заявки на выездной приём', 'consent,auth,record', '0,1,2', 'yes'),
(12, 'doc', 'анализы', 'расшифровка результатов анализов', 'consent,auth,record,analizy', '0,1,2', 'yes'),
(13, 'service', 'услуги', 'услуги', 'consent,auth,record', '0,1,2', 'yes'),
(14, 'bonus', 'акции', 'акции, скидки, бонусы', 'consent,auth,record', '0,1,2', 'yes'),
(15, 'game', 'game', 'игра - пазл', 'consent,auth,record', '0,1,2', 'yes'),
(16, 'cards', 'карточка', 'карточка клиента', 'auth,record', '2', 'yes'),
(17, 'stat', 'stat', 'статистика', 'auth,schedule2', '2', 'yes'),
(18, 'polls', 'опросы', 'опросы', 'auth,record', '0,1,2', 'yes'),
(19, 'scaner', 'link', '', 'auth,record,scaner', '0,1,2', 'yes'),
(20, 'sendler', 'sendler', 'рассылка', 'auth', '2', 'yes'),
(21, 'download', 'link', '', 'download', '0,1,2', 'yes');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
