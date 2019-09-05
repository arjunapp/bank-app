var app = angular.module('learnApp', []);

app.controller('learnController', function ($scope, $http, $filter) {
    $scope.header = "The Bank Finder.";

    $scope.fetchData = fetchData;

    //$scope.fetchData();

    $scope.cities = ['BANGALORE', 'MUMBAI', 'KOLKATA', 'PUNE', 'DELHI'];

    $scope.hideTable = true;
    function fetchData(city) {
        $scope.hideTable = true;
        $scope.loading = true;

        $http.get(`https://vast-shore-74260.herokuapp.com/banks?city=${city}`)
            .then(function (response) {
                $scope.myData = response.data;
                $scope.origData = angular.copy($scope.myData);

                $scope.hideTable = false;
                $scope.loading = false;

            });
    }


    $scope.search = function () {
        var subList = [];
        if($scope.bFilter && $scope.bFilter['ifsc'] && $scope.bFilter['ifsc'].split(',').length > 0){
            var ifscList = $scope.bFilter['ifsc'].split(',')
            angular.forEach($scope.origData,function(val){
                if(ifscList.indexOf(val.ifsc) > -1){
                    subList.push(val);
                }
            });

            var subFilter  = angular.copy($scope.bFilter)
            subFilter['ifsc'] = '';
            $scope.myData = $filter('filter')(subList, subFilter)

        }
        else{
            $scope.myData = $filter('filter')($scope.origData, $scope.bFilter)
        }
    }

    $scope.reset = function(){
        $scope.myData = $scope.origData;
        $scope.bFilter = {};
    }


    $scope.citySelected = function (city) {
        $scope.selectedCity = city;
        $scope.fetchData(city)
    }

});



app
    .filter('titleCase', function () {
        return function (input) {
            input = input || '';
            return input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        };
    })
