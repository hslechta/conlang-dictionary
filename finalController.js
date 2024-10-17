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
    let apiResponse = [];

    $scope.newWord = {lemma: '', definition: '', category: ''};

    if (window.localStorage.getItem("conlang_wordlist")) {
        $scope.words = JSON.parse(window.localStorage.getItem("conlang_wordlist"));
    }
    else {
        $scope.words = exampleWords;
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
        const fileLink = document.createElement('a');
        const newFile = new File(JSON.stringify($scope.words), "conlang_save.txt", {type: "text/plain"});
        fileLink.href = URL.createObjectURL(newFile);
        fileLink.download = "saveFile.txt";
        fileLink.click();
        URL.revokeObjectURL(fileLink.href);
    }

    $scope.updateResults = function(newResults) {
        $scope.results = newResults;
        $scope.$apply();
    }

    $scope.uploadFile = function() {
        console.log("Opening file...");
        let fileInput = document.getElementById(fileUpload).files[0];
        $scope.words = JSON.parse(fileInput);
    }

    // $scope.$watch('results', function() {
    //     console.log("Results changed");
    //     $scope.updateResults(apiResponse);
    // }, true)

    }
);