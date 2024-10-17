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

    $scope.addWord = function() {
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

    $scope.updateResults = function(newResults) {
        $scope.results = newResults;
        $scope.$apply();  // this line creates a few error messages, but it updates the DOM
    }

    $scope.uploadFile = function() {
        console.log("Opening file...");
        let fileInput = document.getElementById(fileUpload);
        fileInput.addEventListener('change', displayFile, false);
    }

    displayFile = function(event) {
        console.log("Displaying file...");
        let file = event.target.files;
        console.log(file.item(0));
        // $scope.words = JSON.parse(file.item(0));
    }

    // $scope.$watch('results', function() {
    //     console.log("Results changed");
    //     $scope.updateResults(apiResponse);
    // }, true)

    }
);