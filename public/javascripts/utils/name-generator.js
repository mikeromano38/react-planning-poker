var request = require('superagent');
var config = require('../config/app-config');
var constants = require('../constants/app-constants');
var RoomsActions = require('../actions/rooms-actions');
var Q = require('q');

var surnamePrefixes = [
	'Von',
	'Van',
	'Mc',
	'Mac',
	'De',
	'Di',
	'O\''
];

var getRandSurnamePrefix = function(){
	var idx = Math.floor( Math.random() * surnamePrefixes.length );
	return surnamePrefixes[ idx ];
};

//http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&includePartOfSpeech=noun&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5
var requestWord = function( params, callback ){
	var deferred = Q.defer();

	request.get( constants.WORDNIK_API_BASE_URL )
		.query({
			hasDictionaryDef: false,
			includePartOfSpeech: params.type,
			minCorpusCount: 0,
			maxCorpusCount: -1,
			minDictionaryCount: 1,
			maxDictionaryCount: -1,
			minLength: params.minLength,
			maxLength: params.maxLength,
			api_key: config.wordnikApiKey
		}).end(function( res ){
			if ( res.status === 200 ){
				deferred.resolve( res );
			} else {
				deferred.reject( res );
			}
		});

	return deferred.promise;
};

var Generator = {};

Generator.generate = function(){
	var firstName = requestWord({
		type: 'noun',
		minLength: 5,
		maxLength: 10
	});

	var lastNameFirstPart = requestWord({
		type: 'adjective',
		minLength: 3,
		maxLength: 8
	});

	var lastNameLastPart = requestWord({
		type: 'noun',
		minLength: 5,
		maxLength: 10
	});

	Q.all([ firstName, lastNameFirstPart, lastNameLastPart ]).then(function( responses ){
		var name =	capitalize( responses[ 0 ].body.word ) + ' ' +
					getRandSurnamePrefix() +
					capitalize( responses[ 1 ].body.word ) +
					responses[ 2 ].body.word;

		RoomsActions.nameGeneratedSuccessfully( name );
	}, function( err ){
		RoomsActions.nameGenerationFailure( err );
	});

	function capitalize( word ){
		return word[ 0 ].toUpperCase() + word.slice(1);
	}
};

module.exports = Generator;