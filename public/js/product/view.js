var ProductView = (function(){
    "use strict";
    
    var init = function(){
        _load.begin();
    },
    _autoLoading = {
        dataProducts: function(page=1) {
            var coditions = "",
                fields = {page: page},
                json = "";
                
            if($("#txtTitle").val().length > 0) {
                coditions += "title:like:%" + $("#txtTitle").val() + "%";
            }
            if($("#txtDescription").val().length > 0) {
                if(coditions.length > 0) {
                    coditions += ";description:like:%" + $("#txtDescription").val() + "%";
                } else {
                    coditions += "description:like:%" + $("#txtDescription").val() + "%";
                }
            }
            if($("#txtPrice").val().length > 0) {
                if(coditions.length > 0) {
                    coditions += ";price:>=:" + $("#txtPrice").val();
                } else {
                    coditions += "price:>=:" + $("#txtPrice").val();
                }
            }

            if(coditions.length > 0) {
                fields = {coditions: coditions};
            }

            json = _configurationGeneral.submitPost("/api/v1/product", fields, "GET");
            _configurationGeneral.createDataTable(json);
        },
    },
    _clickButton = {
        destroy: function(){
            $("table > tbody").on("click", ".destroyProduct", function() {
                var productId = $(this).attr("product_id");

                _configurationGeneral.submitPost("/api/v1/product/" + productId, {}, "DELETE");
                location.reload();
            });
        },
        nextPage: function(){
            $("#paginationNav").on("click", ".page-link", function() {
                _autoLoading.dataProducts($(this).attr("page"));
            });
        },
        search: function() {
            $("#btnSearch").click(function() {
                _autoLoading.dataProducts();
            });
        },
    },
    _configurationGeneral = {
        createDataTable: function(json) {
            var html = "";

            $(json.data).each(function(i, data) {
                html += "<tr>" +
                            "<td>" +
                                "<button type='button' product_id='" + data.id + "' class='btn btn-xs btn-outline-danger destroyProduct' title='Excluir Produto'>" +
                                    "<i class='material-icons vertical-align-sub md-17'>close</i>" +
                                "</button>" +
                                "<a href='/product/" + data.id + "' class='btn btn-xs btn-outline-success' title='Editar Produto'>" +
                                    "<i class='material-icons vertical-align-sub md-17'>edit</i>" +
                                "</a>" +
                            "</td>" +
                            "<td>" + data.id + "</td>" +
                            "<td>" + data.title + "</td>" +
                            "<td>" + data.description + "</td>" +
                            "<td>R$ " + data.price + "</td>" +
                            "<td>" + data.created_at + "</td>" +
                        "</tr>";
            });

            $("table tbody").html(html);
            createPaginator(json);
        },
        submitPost: function(url, fields, type){
            var json,
                csrfToken = $('meta[name="csrf-token"]').attr('content');

            Object.assign(fields, {name: "_token", value: csrfToken});

            $.ajax({
                url: url,
                data: fields,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem("token-jwt"));
                },
                type: type,
                async: false,
                success: function(data){
                    json = data;
                    return false;
                }
            });
            
            return json;
        },
    },
    _load = {
        begin: function(){
            _autoLoading.dataProducts();
            _clickButton.destroy();
            _clickButton.nextPage();
            _clickButton.search();
        }
    };
    return {
        init: init
    };
})();