var Index;
(function (Index) {
    var HelloWorld = (function () {
        function HelloWorld() { }
        HelloWorld.prototype.text = function () {
            return 'Hello TypeScript!';
        };
        return HelloWorld;
    })();
    Index.HelloWorld = HelloWorld;    
})(Index || (Index = {}));
