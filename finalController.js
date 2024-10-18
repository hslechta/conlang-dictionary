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
    const uploadDialog = document.getElementById("uploadDialog");
    let apiResponse = [];

    $scope.newWord = {lemma: '', definition: '', category: ''};
    $scope.generator = {syllableCount: 2, onsetConsCount: 2, codaConsCount: 1};
    $scope.generatedWord = {lemma: '', definition: '', category: ''};
    $scope.uploadWords = [];

    if (window.localStorage.getItem("conlang_wordlist")) {
        $scope.words = JSON.parse(window.localStorage.getItem("conlang_wordlist"));
    }
    else {
        $scope.words = exampleWords;
    }

    $scope.generateWord = function() {
        let syllables = Math.round(Math.random() * Number($scope.generator.syllableCount));
        if (syllables == 0) {
            syllables = 1;
        }
        let onsets = Math.round(Math.random() * Number($scope.generator.onsetConsCount));
        let codas = Math.round(Math.random() * Number($scope.generator.codaConsCount));
        for (let i = 0; i < syllables; i++) {
            let syll = generateSyllable(onsets, codas);
            $scope.generatedWord.lemma += syll;
        }
        let tempWord = $scope.generatedWord;
        console.log(tempWord);
        $scope.words.push(tempWord);
        $scope.generatedWord = {lemma: '', definition: '', category: ''};
    }

    generateSyllable = function(numOnset, numCoda) {
        let vowelElems = document.getElementsByClassName('vowel');
        let consElems = document.getElementsByClassName('consonant');
        let vowelFound = false;
        let vowel = '';
        while (!vowelFound) {
            let randNum = Math.round(Math.random() * (vowelElems.length - 1));
            let possVowel = vowelElems.item(randNum);
            if (possVowel.checked) {
                vowel = possVowel.id + '';
                vowelFound = true;
            }
        }
        let onset = '';
        let coda = '';
        for (let j = 0; j < numOnset; j++) {
            let consFound = false;
            let onsetLetter = '';
            while (!consFound) {
                let randNum = Math.round(Math.random() * (consElems.length - 1));
                let possOnset = consElems.item(randNum);
                if (possOnset.checked) {
                    onsetLetter = possOnset.id + '';
                    consFound = true;
                }
            }
            onset += onsetLetter;
        }
        for (let k = 0; k < numCoda; k++) {
            let consFound = false;
            let codaLetter = '';
            while (!consFound) {
                let randNum = Math.round(Math.random() * (consElems.length - 1));
                let possCoda = consElems.item(randNum);
                if (possCoda.checked) {
                    codaLetter = possCoda.id + '';
                    consFound = true;
                }
            }
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
                console.log(response);
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
        $scope.uploadWords = [];
        uploadDialog.showModal();
    }

    $scope.confirmUpload = function() {
        $scope.words = JSON.parse($scope.uploadWords);
        uploadDialog.close();
    }

    $scope.cancelUpload = function() {
        $scope.uploadWords = [];
        uploadDialog.close();
    }

    }
);