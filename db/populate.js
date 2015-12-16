var _ = require('lodash');
var http = require('http');
var async = require('async');
var Parse = require('parse/node');
var rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });
var SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').load();

// For potential usage later on...
// var program = require('commander');
// program
//   .version('0.0.1')
//   .option('-f', '--festival <name>', 'Populate for specified festival (default: coachella)')
//   .parse(process.argv);

var spotify = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_SECRET_KEY
});

Parse.initialize('7QWvetVv8YZmDkQ1zCM7KLADoCcMOZ3mCJHGNpo9', 't2jFEQ6b6fJF7DxYKteRYFdWS28Mve3LzaCgSHok');
var spotifyBaseURL = 'https://api.spotify.com/v1/search?type=artist&limit=1&q=';
var BACKUP_AVATAR = 'https://i.scdn.co/image/837c977024362a7f6d1873027e2a8664e21f911a';

var Festival = Parse.Object.extend('Festival')
  , Performance = Parse.Object.extend('Performance')
  , Artist = Parse.Object.extend('Artist');

var festival = new Festival({
  'name': 'Electric Daisy Carnival',
  'shortName': 'EDC',
  'start': new Date(2015, 4, 17, 12, 00),
  'end': new Date(2015, 4, 19, 12, 00),
  'stages': ["Main", "Sahara", "Gobi", "Mojave"]
});

var performances = [
  // Day 1
    new Performance({'stage': 1, 'start': new Date(2015, 4, 17, 13, 15), 'end': new Date(2015, 4, 17, 14, 00)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 17, 14, 25), 'end': new Date(2015, 4, 17, 15, 15)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 17, 15, 40), 'end': new Date(2015, 4, 17, 16, 30)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 17, 16, 55), 'end': new Date(2015, 4, 17, 17, 40)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 17, 18, 05), 'end': new Date(2015, 4, 17, 18, 55)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 17, 19, 20), 'end': new Date(2015, 4, 17, 20, 10)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 17, 21, 15), 'end': new Date(2015, 4, 17, 22, 05)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 17, 22, 35), 'end': new Date(2015, 4, 17, 23, 35)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 17, 11, 15), 'end': new Date(2015, 4, 17, 11, 45)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 17, 11, 55), 'end': new Date(2015, 4, 17, 12, 35)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 17, 12, 55), 'end': new Date(2015, 4, 17, 13, 35)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 17, 14, 05), 'end': new Date(2015, 4, 17, 14, 45)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 17, 15, 05), 'end': new Date(2015, 4, 17, 15, 55)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 17, 16, 20), 'end': new Date(2015, 4, 17, 17, 10)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 17, 17, 40), 'end': new Date(2015, 4, 17, 18, 30)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 17, 18, 55), 'end': new Date(2015, 4, 17, 19, 45)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 17, 20, 10), 'end': new Date(2015, 4, 17, 21, 10)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 17, 21, 35), 'end': new Date(2015, 4, 17, 22, 35)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 17, 11, 15), 'end': new Date(2015, 4, 17, 11, 50)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 17, 12, 00), 'end': new Date(2015, 4, 17, 12, 45)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 17, 12, 55), 'end': new Date(2015, 4, 17, 13, 35)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 17, 13, 55), 'end': new Date(2015, 4, 17, 14, 40)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 17, 15, 00), 'end': new Date(2015, 4, 17, 15, 50)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 17, 16, 15), 'end': new Date(2015, 4, 17, 17, 00)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 17, 17, 30), 'end': new Date(2015, 4, 17, 18, 20)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 17, 18, 50), 'end': new Date(2015, 4, 17, 19, 40)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 17, 20, 10), 'end': new Date(2015, 4, 17, 20, 55)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 17, 21, 25), 'end': new Date(2015, 4, 17, 22, 20)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 17, 22, 50), 'end': new Date(2015, 4, 17, 23, 50)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 17, 13, 00), 'end': new Date(2015, 4, 17, 13, 40)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 17, 14, 15), 'end': new Date(2015, 4, 17, 15, 00)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 17, 15, 30), 'end': new Date(2015, 4, 17, 16, 35)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 17, 16, 45), 'end': new Date(2015, 4, 17, 17, 30)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 17, 18, 00), 'end': new Date(2015, 4, 17, 19, 00)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 17, 19, 15), 'end': new Date(2015, 4, 17, 20, 25)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 17, 20, 35), 'end': new Date(2015, 4, 17, 21, 55)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 17, 22, 05), 'end': new Date(2015, 4, 17, 23, 00)}),

  // Day 2
    new Performance({'stage': 1, 'start': new Date(2015, 4, 18, 13, 15), 'end': new Date(2015, 4, 18, 14, 00)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 18, 14, 25), 'end': new Date(2015, 4, 18, 15, 15)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 18, 15, 40), 'end': new Date(2015, 4, 18, 16, 30)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 18, 16, 55), 'end': new Date(2015, 4, 18, 17, 40)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 18, 18, 05), 'end': new Date(2015, 4, 18, 18, 55)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 18, 19, 20), 'end': new Date(2015, 4, 18, 20, 10)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 18, 21, 15), 'end': new Date(2015, 4, 18, 22, 05)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 18, 22, 35), 'end': new Date(2015, 4, 18, 23, 35)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 18, 11, 15), 'end': new Date(2015, 4, 18, 11, 45)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 18, 11, 55), 'end': new Date(2015, 4, 18, 12, 35)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 18, 12, 55), 'end': new Date(2015, 4, 18, 13, 35)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 18, 14, 05), 'end': new Date(2015, 4, 18, 14, 45)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 18, 15, 05), 'end': new Date(2015, 4, 18, 15, 55)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 18, 16, 20), 'end': new Date(2015, 4, 18, 17, 10)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 18, 17, 40), 'end': new Date(2015, 4, 18, 18, 30)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 18, 18, 55), 'end': new Date(2015, 4, 18, 19, 45)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 18, 20, 10), 'end': new Date(2015, 4, 18, 21, 10)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 18, 21, 35), 'end': new Date(2015, 4, 18, 22, 35)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 18, 11, 15), 'end': new Date(2015, 4, 18, 11, 50)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 18, 12, 00), 'end': new Date(2015, 4, 18, 12, 45)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 18, 12, 55), 'end': new Date(2015, 4, 18, 13, 35)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 18, 13, 55), 'end': new Date(2015, 4, 18, 14, 40)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 18, 15, 00), 'end': new Date(2015, 4, 18, 15, 50)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 18, 16, 15), 'end': new Date(2015, 4, 18, 17, 00)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 18, 17, 30), 'end': new Date(2015, 4, 18, 18, 20)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 18, 18, 50), 'end': new Date(2015, 4, 18, 19, 40)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 18, 20, 10), 'end': new Date(2015, 4, 18, 20, 55)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 18, 21, 25), 'end': new Date(2015, 4, 18, 22, 20)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 18, 22, 50), 'end': new Date(2015, 4, 18, 23, 50)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 18, 13, 00), 'end': new Date(2015, 4, 18, 13, 40)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 18, 14, 15), 'end': new Date(2015, 4, 18, 15, 00)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 18, 15, 30), 'end': new Date(2015, 4, 18, 16, 35)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 18, 16, 45), 'end': new Date(2015, 4, 18, 17, 30)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 18, 18, 00), 'end': new Date(2015, 4, 18, 19, 00)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 18, 19, 15), 'end': new Date(2015, 4, 18, 20, 25)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 18, 20, 35), 'end': new Date(2015, 4, 18, 21, 55)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 18, 22, 05), 'end': new Date(2015, 4, 18, 23, 00)}),

  // Day 3
    new Performance({'stage': 1, 'start': new Date(2015, 4, 19, 13, 15), 'end': new Date(2015, 4, 19, 14, 00)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 19, 14, 25), 'end': new Date(2015, 4, 19, 15, 15)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 19, 15, 40), 'end': new Date(2015, 4, 19, 16, 30)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 19, 16, 55), 'end': new Date(2015, 4, 19, 17, 40)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 19, 18, 05), 'end': new Date(2015, 4, 19, 18, 55)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 19, 19, 20), 'end': new Date(2015, 4, 19, 20, 10)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 19, 21, 15), 'end': new Date(2015, 4, 19, 22, 05)}),
    new Performance({'stage': 1, 'start': new Date(2015, 4, 19, 22, 35), 'end': new Date(2015, 4, 19, 23, 35)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 19, 11, 15), 'end': new Date(2015, 4, 19, 11, 45)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 19, 11, 55), 'end': new Date(2015, 4, 19, 12, 35)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 19, 12, 55), 'end': new Date(2015, 4, 19, 13, 35)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 19, 14, 05), 'end': new Date(2015, 4, 19, 14, 45)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 19, 15, 05), 'end': new Date(2015, 4, 19, 15, 55)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 19, 16, 20), 'end': new Date(2015, 4, 19, 17, 10)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 19, 17, 40), 'end': new Date(2015, 4, 19, 18, 30)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 19, 18, 55), 'end': new Date(2015, 4, 19, 19, 45)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 19, 20, 10), 'end': new Date(2015, 4, 19, 21, 10)}),
    new Performance({'stage': 2, 'start': new Date(2015, 4, 19, 21, 35), 'end': new Date(2015, 4, 19, 22, 35)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 19, 11, 15), 'end': new Date(2015, 4, 19, 11, 50)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 19, 12, 00), 'end': new Date(2015, 4, 19, 12, 45)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 19, 12, 55), 'end': new Date(2015, 4, 19, 13, 35)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 19, 13, 55), 'end': new Date(2015, 4, 19, 14, 40)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 19, 15, 00), 'end': new Date(2015, 4, 19, 15, 50)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 19, 16, 15), 'end': new Date(2015, 4, 19, 17, 00)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 19, 17, 30), 'end': new Date(2015, 4, 19, 18, 20)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 19, 18, 50), 'end': new Date(2015, 4, 19, 19, 40)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 19, 20, 10), 'end': new Date(2015, 4, 19, 20, 55)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 19, 21, 25), 'end': new Date(2015, 4, 19, 22, 20)}),
    new Performance({'stage': 3, 'start': new Date(2015, 4, 19, 22, 50), 'end': new Date(2015, 4, 19, 23, 50)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 19, 13, 00), 'end': new Date(2015, 4, 19, 13, 40)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 19, 14, 15), 'end': new Date(2015, 4, 19, 15, 00)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 19, 15, 30), 'end': new Date(2015, 4, 19, 16, 35)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 19, 16, 45), 'end': new Date(2015, 4, 19, 17, 30)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 19, 18, 00), 'end': new Date(2015, 4, 19, 19, 00)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 19, 19, 15), 'end': new Date(2015, 4, 19, 20, 25)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 19, 20, 35), 'end': new Date(2015, 4, 19, 21, 55)}),
    new Performance({'stage': 4, 'start': new Date(2015, 4, 19, 22, 05), 'end': new Date(2015, 4, 19, 23, 00)}),
];

var artists = [
  // Day 1
    // Stage 1
    new Artist({'name': 'Vic Mensa'}),
    new Artist({'name': 'Action Bronson'}),
    new Artist({'name': 'Charles Bradley'}),
    new Artist({'name': 'Azealia Banks'}),
    new Artist({'name': 'The War on Drugs'}),
    new Artist({'name': 'Interpol'}),
    new Artist({'name': 'Tame Impala'}),
    new Artist({'name': 'AC/DC'}),

    // Stage 2
    new Artist({'name': 'Alchemy'}),
    new Artist({'name': 'Saber Tooth Tiger'}),
    new Artist({'name': 'Brant Bjork'}),
    new Artist({'name': 'Allah-Las'}),
    new Artist({'name': 'Lil B'}),
    new Artist({'name': 'Angus & Julia Stone'}),
    new Artist({'name': 'Raekwon'}),
    new Artist({'name': 'Alabama Shakes'}),
    new Artist({'name': 'Steely Dan'}),
    new Artist({'name': 'Nero'}),

    // Stage 3
    new Artist({'name': 'Moustache'}),
    new Artist({'name': 'Ruen Brothers'}),
    new Artist({'name': 'Eagulls'}),
    new Artist({'name': 'Cloud Nothings'}),
    new Artist({'name': 'Ab-Soul'}),
    new Artist({'name': 'Kimbra'}),
    new Artist({'name': 'Ride'}),
    new Artist({'name': 'Hot Natured'}),
    new Artist({'name': 'Gorgon City'}),
    new Artist({'name': 'Todd Terje'}),
    new Artist({'name': 'Squarepusher'}),

    // Stage 4
    new Artist({'name': 'Freddy Bear'}),
    new Artist({'name': 'Marques Wyatt'}),
    new Artist({'name': 'Lee Foss'}),
    new Artist({'name': 'Chris Malinchak'}),
    new Artist({'name': 'Erol Alkan'}),
    new Artist({'name': 'Jon Hopkins'}),
    new Artist({'name': 'Pete Tong'}),
    new Artist({'name': 'MK'}),

  // Day 2
    // Stage 1
    new Artist({'name': 'Bostich+Fussible'}),
    new Artist({'name': 'Clean Bandit'}),
    new Artist({'name': 'Bad Religion'}),
    new Artist({'name': 'Milky Chance'}),
    new Artist({'name': 'Hozier'}),
    new Artist({'name': 'alt-J'}),
    new Artist({'name': 'Jack White'}),
    new Artist({'name': 'The Weeknd'}),

    // Stage 2
    new Artist({'name': 'SOJA'}),
    new Artist({'name': 'PHOX'}),
    new Artist({'name': 'Jamestown Revival'}),
    new Artist({'name': 'Perfume Genius'}),
    new Artist({'name': 'Royal Blood'}),
    new Artist({'name': 'Chet Faker'}),
    new Artist({'name': 'John Misty'}),
    new Artist({'name': 'Tyler the Creator'}),
    new Artist({'name': 'Flosstradamus'}),
    new Artist({'name': 'Axwell'}),

    // Stage 3
    new Artist({'name': 'Coasts'}),
    new Artist({'name': 'Parquet Courts'}),
    new Artist({'name': 'Lights'}),
    new Artist({'name': 'Benjamin Booker'}),
    new Artist({'name': 'Cashmere Cat'}),
    new Artist({'name': 'Yelle'}),
    new Artist({'name': 'Glass Animals'}),
    new Artist({'name': 'FKA twigs'}),
    new Artist({'name': 'Drive Like Jehu'}),
    new Artist({'name': 'Swans'}),
    new Artist({'name': 'The Gaslamp Killer'}),

    // Stage 4
    new Artist({'name': 'Ben Howard'}),
    new Artist({'name': 'Lauren Lane'}),
    new Artist({'name': 'Andrew Olivia'}),
    new Artist({'name': 'Tale of Us'}),
    new Artist({'name': 'Carl Craig'}),
    new Artist({'name': 'DJ Harvey'}),
    new Artist({'name': 'Cris Cab'}),
    new Artist({'name': 'Annie Mac'}),

  // Day 3
    // Stage 1
    new Artist({'name': 'Blue Scholars'}),
    new Artist({'name': 'Saint Motel'}),
    new Artist({'name': 'Circa Survive'}),
    new Artist({'name': 'St. Lucia'}),
    new Artist({'name': 'Marina Diamonds'}),
    new Artist({'name': 'Kaskade'}),
    new Artist({'name': 'Florence + the Machine'}),
    new Artist({'name': 'Drake'}),

    // Stage 2
    new Artist({'name': 'Gabe Real'}),
    new Artist({'name': 'Chicano Batman'}),
    new Artist({'name': 'Joyce Manor'}),
    new Artist({'name': 'Mac DeMarco'}),
    new Artist({'name': 'Built to Spill'}),
    new Artist({'name': 'Jenny Lewis'}),
    new Artist({'name': 'Ryan Adams'}),
    new Artist({'name': 'St. Vincent'}),
    new Artist({'name': 'Fitz & the Tantrums'}),
    new Artist({'name': 'David Guetta'}),

    // Stage 3
    new Artist({'name': 'Eevaan tre'}),
    new Artist({'name': 'Night Terrors'}),
    new Artist({'name': 'Angel Olsen'}),
    new Artist({'name': 'M0'}),
    new Artist({'name': 'Sturgil Simpson'}),
    new Artist({'name': 'Desaparecidos'}),
    new Artist({'name': 'The Cribs'}),
    new Artist({'name': 'Meek Mill'}),
    new Artist({'name': 'Jamie xx'}),
    new Artist({'name': 'ODESZA'}),
    new Artist({'name': 'Kaytranada'}),

    // Stage 4
    new Artist({'name': 'Trent Cantrelle'}),
    new Artist({'name': 'Doc MArtin'}),
    new Artist({'name': 'tINI'}),
    new Artist({'name': 'Tiger and Woods'}),
    new Artist({'name': 'John Talabot'}),
    new Artist({'name': 'The Cool Kids'}),
    new Artist({'name': 'Guy Gerber'}),
    new Artist({'name': 'J.E.S.+S.'}),
];

var progress = 0;
function fetchArtistAvatar(artist, cb) {
  console.log('Fetching avatar for ' + artist.get('name') + '.. (' + _.floor(100 * ((progress++) / artists.length)) + '%)');
  spotify.searchArtists(artist.get('name')).then(
    function(data) {
      // Get the band's avatars, default to one if none exist
      var avatars = _.get(data, 'body.artists.items[0].images', [{url: BACKUP_AVATAR}]);

      var avatar = _(avatars).take(3).last().url || BACKUP_AVATAR;
      // It seems as though spotify orders the images from big to small
      // images[3+] seemed too small, so go from 2 -> 0
      artist.set('avatar', avatar);
      cb(null);
    },
    function(err) { cb(err); }
  );
}

function finishedAvatarFetch(err) {
  if (err) { console.log('Could not fetch artist avatars.', err); process.exit(1); }

  rl.question('Loaded data for Coachella, are you sure you want to save it to Parse? ([y]/n)\n', function(answer) {
    if (answer.toLowerCase() !== 'y') {
      console.log('Exiting... Bye!');
      process.exit(1);
    }

    console.log('Continuing...');
    populate();
  });
}

// Gather all festival-related data and save it into Parse
function populate() {
  var promisesPhase1 = [],
      promisesPhase2 = [];

  // Phase 1: Save festival and artists
  promisesPhase1.push(
    Parse.Object.saveAll(artists),
    festival.save()
  );

  // Phase 2: When festival and artists saved, save performances with relations
  Parse.Promise.when(promisesPhase1).then(function(saved_artists, saved_festival) {
    _.forEach(performances, function(perf, index) {
      perf.set('artist', saved_artists[index]);
      perf.set('festival', saved_festival);
      promisesPhase2.push(perf.save());
    });

    Parse.Promise.when(promisesPhase2).then(function() {
      console.log('Database populated for Coachella');
      process.exit(0);
    });
  });
}


// Begin.
// Load spotify API data for each artist, then populate() when done
async.eachSeries(artists, fetchArtistAvatar, finishedAvatarFetch);
