angular.module('myApp', [])
.controller('FinalController', function ($scope) {

    const exampleWords = [
        {lemma: 'apfel', definition: 'apple', category: 'food'},
        {lemma: 'banane', definition: 'banana', category: 'food'},
        {lemma: 'gato', definition: 'cat', category: 'animal'},
        {lemma: 'pes', definition: 'dog', category: 'animal'}
    ];
    const apiUrl = "https://en.wiktionary.org/w/api.php";
    const addDialog = document.getElementById("addDialog");
    const downloadDialog = document.getElementById("downloadDialog");
    let apiResponse = [];

    $scope.newWord = {lemma: '', definition: '', category: ''};
    $scope.generator = {syllableCount: 2, onsetConsCount: 2, codaConsCount: 1};

    if (window.localStorage.getItem("conlang_wordlist")) {
        $scope.words = JSON.parse(window.localStorage.getItem("conlang_wordlist"));
    }
    else {
        $scope.words = exampleWords;
    }

    $scope.generateWords = function() {
        console.log("Generating words...");
        console.log($scope.generator);
        let syllables = Math.floor(Math.random() * $scope.generator.syllableCount);
        let onsets = Math.floor(Math.random() * $scope.generator.onsetConsCount);
        let codas = Math.floor(Math.random() * $scope.generator.codaConsCount);
        let generatedWord = {lemma: '', definition: 'def', category: 'cat'};
        for (let i = 0; i < syllables; i++) {
            let syll = generateSyllable(onsets, codas);
            generatedWord.lemma += syll;
        }
        $scope.words.push(generatedWord);
    }

    generateSyllable = function(numOnset, numCoda) {
        let vowelElems = document.getElementsByClassName('vowel');
        let consElems = document.getElementsByClassName('consonant');
        let vowel = vowelElems.item(Math.floor(Math.random() * vowelElems.length)).id;
        let onset = '';
        let coda = '';
        for (let j = 0; j < numOnset; j++) {
            let onsetLetter = consElems.item(Math.floor(Math.random() * consElems.length)).id;
            onset += onsetLetter;
        }
        for (let k = 0; k < numCoda; k++) {
            let codaLetter = consElems.item(Math.floor(Math.random() * consElems.length)).id;
            coda += codaLetter;
        }
        let newSyllable = onset + vowel + coda;
        return newSyllable;
    }
    
    $scope.checkWord = function(index) {
        apiResponse = [];
        let sendWord = $scope.words[index].lemma;
        let fullUrl = apiUrl + "?origin=*&action=opensearch&search=" + sendWord + "&namespace=*";
        fetch(fullUrl).
            then(function(response) {return response.json();}).
            then(function(response) {
                for (let i = 0; i < response[1].length; i++) {
                    apiResponse.push({'lemma': response[1][i], 'link': response[3][i]});
                }
                $scope.updateResults(apiResponse);
                }).catch(function(error) {console.log(error);});
    }

    $scope.deleteWord = function(index) {
        $scope.words.splice(index, 1);
    }

    $scope.addWord = function() {
        $scope.newWord = {lemma: '', definition: '', category: ''};
        addDialog.showModal();
    }

    $scope.confirmAdd = function() {
        $scope.words.push($scope.newWord);
        addDialog.close();
    }

    $scope.cancelAdd = function() {
        $scope.newWord = {lemma: '', definition: '', category: ''};
        addDialog.close();
    }

    $scope.saveList = function() {
        window.localStorage.setItem("conlang_wordlist", JSON.stringify($scope.words));
    }

    $scope.saveFile = function() {
        $scope.downloadText = JSON.stringify($scope.words);
        downloadDialog.showModal();
    }

    $scope.closeDownload = function() {
        downloadDialog.close();
    }

    $scope.updateResults = function(newResults) {
        $scope.results = newResults;
        $scope.$apply();
    }

    $scope.uploadFile = function() {
        console.log("Opening file...");
        console.log(document.getElementById(fileUpload));
        console.log(document.getElementById(fileUpload).files);
        let fileInput = document.getElementById(fileUpload).files[0];
        console.log(fileInput);
        $scope.words = JSON.parse(fileInput);
        console.log($scope.words);
    }

    }
);