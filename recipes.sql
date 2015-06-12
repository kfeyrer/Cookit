-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 11. Jun 2015 um 19:44
-- Server-Version: 5.6.24
-- PHP-Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `cookit`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `recipes`
--

CREATE TABLE IF NOT EXISTS `recipes` (
  `id` mediumint(9) NOT NULL,
  `name` varchar(255) COLLATE latin1_bin NOT NULL,
  `ingredients` text COLLATE latin1_bin NOT NULL,
  `description` text COLLATE latin1_bin NOT NULL,
  `image` text COLLATE latin1_bin,
  `lat` varchar(100) COLLATE latin1_bin DEFAULT NULL,
  `lon` varchar(100) COLLATE latin1_bin DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1 COLLATE=latin1_bin;

--
-- Daten für Tabelle `recipes`
--

INSERT INTO `recipes` (`id`, `name`, `ingredients`, `description`, `image`, `lat`, `lon`) VALUES
(1, 'Rezept1', '1 Ei,2g Zucker', 'Beschreibung', 'NULL', NULL, NULL),
(2, 'RezeptApp1', '1 Ei', 'Beschreibung', 'logo.png', NULL, NULL),
(3, 'RezeptApp2', '1 Ei', 'Beschreibung', 'logo.png', NULL, NULL),
(6, 'RezeptAppwith loc', '1 Ei', 'Locationtest', 'logo.png', '48.2082647', '16.373920599999998'),
(7, 'RezeptAppWS', '1 Ei', 'Rezept mit Websocket', 'logo.png', 'NULL', 'NULL'),
(8, 'TestRezept', '1 Ei', 'Dies ist eine Testbeschreibung', 'logo.png', '47.4532761', '15.332007'),
(9, 'Präsentations Rezept', '1 Ei,20dag Mehl', 'Das ist eine Beschreibung', 'logo.png', '47.453213899999994', '15.3320729'),
(10, 'Rezept 120', '1 Ei,2 Eier', 'Test', 'logo.png', 'NULL', 'NULL'),
(11, 'Rezept15', '1 Ei,2 Eier,3 Eier', 'Test', 'logo.png', 'NULL', 'NULL'),
(12, 'Rezept Websocket Test', '1 Ei,2 Eier,3 Eier', 'Test', 'logo.png', 'NULL', 'NULL'),
(13, 'Websocket 2', '1 EI', 'Test', 'logo.png', 'NULL', 'NULL'),
(14, 'Websocket 3', '1 Ei', 'test', 'logo.png', 'NULL', 'NULL'),
(15, 'Websocket 5', '1 EI', 'test', 'logo.png', 'NULL', 'NULL'),
(16, 'Rezept Websocket 25', '1 Ei', 'Test', 'logo.png', 'NULL', 'NULL'),
(17, 'Rezept 1', '1 Ei', 'Test', 'logo.png', 'NULL', 'NULL');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` mediumint(9) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=18;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
