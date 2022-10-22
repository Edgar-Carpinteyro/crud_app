class Explorer {        //class creates the object explorer
    constructor(name) {
        this.name = name;
        this.countries = [];
    }

    addCountry(place, city) {       //This adds a new country and destination
        this.countries.push(new Country(place, city));
    }
}

class Country {     //class creates the object country
    constructor(place, city) {      //place = name of the country, city = name of the destination within the country.
        this.place = place;
        this.city = city;
    }
}

class ExplorerCreation {
    static url ='https://635080e63e9fa1244e47b770.mockapi.io/explorers/';       //mock API

    static getAllExplorers() {
        return $.get(this.url);
    }

    static getExplorer(id) {
        return $.get(this.url + `/${id}`);
    }

    static createExplorer(explorer) {
        return $.post(this.url, explorer);
    }

    static updateExplorer(explorer){
        return $.ajax({
            url: this.url + `/${explorer._id}`,
            dataType: 'json',
            data: JSON.stringify(explorer),
            contentType: 'application/json',
            type: 'PUT'
        })
    }

    static deleteExplorer(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static explorers;

    static getAllExplorers() {
        ExplorerCreation.getAllExplorers().then(explorers => this.render (explorers));
    }

    static createExplorer(name) {
        ExplorerCreation.createExplorer(new Explorer(name))
        .then(() => {
            return ExplorerCreation.getAllExplorers();
        })
        .then((explorers) => this.render(explorers));
    }

    static deleteExplorer(id) {
        ExplorerCreation.deleteExplorer(id)
        .then(() => {
            return ExplorerCreation.getAllExplorers();
        })
        .then((explorers) => this.render(explorers));
    }

    static addCountry(id) {
        for (let explorer of this.explorers) {
            if (explorer._id == id) {       //country was not adding because it was missing underscore.
                explorer.countries.push(new Country($(`#${explorer._id}-country-place`).val(), $(`#${explorer._id}-country-city`).val()));
                ExplorerCreation.updateExplorer(explorer)
                    .then(() => {
                        return ExplorerCreation.getAllExplorers();
                    })
                    .then ((explorers) => this.render(explorers));
            }
        }
    }

    static deleteCountry(explorerId, countryId) {
        for (let explorer of this.explorers) {
            if (explorer._id == explorerId) {
                for (let country of explorer.countries) {        
                    if (country._id == countryId) {
                        explorer.countries.splice(explorer.countries.indexOf(country), 1);
                        ExplorerCreation.updateExplorer(explorer)
                            .then(() => {
                                return ExplorerCreation.getAllExplorers();
                            })
                            .then((explorers) => this.render(explorers));
                    }
                }
            }
        }
    }

    static render(explorers) {
        this.explorers = explorers
        $('#app').empty();
        for (let explorer of explorers) {
            $('#app').prepend(
                `<div id="${explorer._id}" class="card">
                    <div class="card-header alert alert-info" role="alert">
                        <h2>${explorer.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteExplorer('${explorer._id}')">DELETE</button>
                    </div>
                    <div class="card-body alert alert-light" role="alert">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm" >
                                    <input type="text" id="${explorer._id}-country-place" class="form-control" placeholder="Name of Country">
                                </div>
                                <div class="col-sm" >
                                    <input type="text" id="${explorer._id}-country-city" class="form-control" placeholder="Name of Destination">
                                </div> 
                            </div> 
                            <br>
                        </div>
                        <div>
                        <button id="${explorer._id}-new-country" onclick="DOMManager.addCountry('${explorer._id}')" class="btn btn-outline-info form-control">ADD</button>
                        </div>
                    </div>
                </div> <br>`
            );
            for (let country of explorer.countries) {
                $(`#${explorer._id}`).find('.card-body').append(
                    `<p>
                        <span id="place-${country._id}"><strong>Place: </strong> ${country.place}</span>
                        <span id="city-${country._id}"><strong>City: </strong> ${country.city}</span>
                        <button class="btn btn-outline-danger" onclick="DOMManager.deleteCountry(${explorer._id}, ${country._id})">Delete</button>` //deleted the quotes on explorer._id and country._id
                )
            }
        }
    }
};

$('#create-new-explorer').click(() => {
    DOMManager.createExplorer($('#new-explorer-name').val());
    $('#new-explorer-name').val('');
});

DOMManager.getAllExplorers();
