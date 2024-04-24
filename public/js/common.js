const alphRegex = /^[a-zA-Z\s]+$/;

async function adoptAnimal(id) {
    const url = `http://localhost:3000/animals/adoptions`;
    if (confirm('Would you like to adopt this animal?') === true) {
        fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ AnimalId: id })
        }).then(async response => {
            if (response.ok) {
                console.log('Successfully created adoption')
                location.reload();
                return Promise.resolve('Successfully created adoption');
            }
            const errorMessage = await response.text();
            alert(errorMessage);
        }).catch(err => {
            console.log(err.statusText);
        })
    }
}
async function deleteAnimal(url, id) {
    if (confirm('Are you sure you want to cancel this adoption?') === true) {
        fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            method: 'DELETE',
            body: JSON.stringify({ AnimalId: id })
        }).then(async response => {
            if (response.ok) {
                location.reload();
                return Promise.resolve('Successfully cancelled adoption');
            }
            const errorMessage = await response.text();
            alert(errorMessage);
        }).catch(err => {
            console.log(err);
        })
    }
}
async function updateSpecies(id) {
    const specieRegex = /^[a-zA-Z\s]+$/
    const url = 'http://localhost:3000/species/update';
    newSpecies = prompt("Update species")
    if (newSpecies === null) return;
    if (!specieRegex.test(newSpecies)) {
        alert('Specie cannot be empty and can only include alphabetical characters');
        return;
    }

    newSize = prompt('Update size');
    if (newSize === null) return;
    if (!specieRegex.test(newSize)) {
        alert('Size cannot be empty and can only include alphabetical characters');
        return;
    }
   
    if (specieRegex.test(newSpecies) && specieRegex.test(newSize)) {
        fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify({ id: id, SpecieName: newSpecies, Size: newSize })
        }).then(async response => {
            if (response.ok) {
                console.log('Successfully updated name for specie');
                location.reload();
                return Promise.resolve('Successfully updated name for specie');
            }
            const errorMessage = await response.text();
            alert(errorMessage);
        }).catch(err => {
            if (err) {
                alert(err);
            }
        })
    }
}
async function addSpecies() {
    let specie = prompt('What should the new species be named?');
    if (specie === null) return;
    if (!alphRegex.test(specie)) {
        alert('Specie cannot be empty and can only include alphabetical characters');
        return;
    }

    let size = prompt('What is the size of the specie?');
    if (size === null) return;
    if (!alphRegex.test(size)) {
        alert('Size cannot be empty and can only include alphabetical characters');
        return;
    }
  


    if (alphRegex.test(specie) && alphRegex.test(size)) {
        const url = 'http://localhost:3000/species/add-specie';
        fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ SpecieName: specie, Size: size })
        }).then(async response => {
            if (response.ok) {
                console.log('Successfully added specie');
                location.reload();
                return Promise.resolve('Successfully created specie');
            }
            const errorMessage = await response.text();
            alert(errorMessage);
        }).catch(err => {
            if (err) {
                alert(err.statusText);
                console.log(err.statusText);
            }
        })
    }

}
async function deleteSpecies(id) {
    const url = 'http://localhost:3000/species/delete';
    if (confirm('Are you sure you want to delete this specie?') === true) {
        fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            method: 'DELETE',
            body: JSON.stringify({ id: id })
        }).then(async response => {
            if (response.ok) {
                console.log('Successfully deleted specie');
                location.reload();
                return Promise.resolve('Deleted Specie');
            }
            const errorMessage = await response.text();
            alert(errorMessage);
        }).catch(err => {
            if (err) {
                console.error(err);
            }
        })
    }

}
async function addTemperament() {
    let name = prompt('What temperament would you like to add?');
    const url = 'http://localhost:3000/temperament/add';
    if (name === null) return;
    if (!alphRegex.test(name)) {
        alert('Temperament cannot be empty and can only include alphabetical characters');
        return;
    }
   
    if (alphRegex.test(name)) {
        fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ TemperamentName: name })
        }).then(async response => {
            if (response.ok) {
                console.log('Successfully created temperament');
                location.reload();
                return Promise.resolve('Successfully created temperament');
            }
            const errorMessage = await response.text();
            alert(errorMessage);
        }).catch(err => {
            if (err) {
                console.log(err.statusText);
            }
        })
    }
}
async function updateTemperament(id) {
    newTemperament = prompt("Update temperament");
    if (newTemperament === null) return;
    if (!alphRegex.test(newTemperament)) {
        alert('Temperament cannot be empty and can only include alphabetical characters');
        return;
    }
   

    if (alphRegex.test(newTemperament)) {
        const url = 'http://localhost:3000/temperament/update';
        fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify({ id: id, TemperamentName: newTemperament })
        }).then(async response => {
            if (response.ok) {
                console.log('Updated temperament');
                location.reload();
                return Promise.resolve('Updated temperament');
            }
            const errorMessage = await response.text();
            alert(errorMessage);
        }).catch(err => {
            console.log(err);
        })
    }
}
async function deleteTemperament(id) {
    if (confirm('Are you sure you want to delete this temperament?') === true) {
        const url = 'http://localhost:3000/temperament/delete';
        fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            method: 'DELETE',
            body: JSON.stringify({ id: id })
        }).then(async response => {
            if (response.ok) {
                console.log('Deleted temperament');
                location.reload();
                return Promise.resolve();
            }
            const errorMessage = await response.text();
            alert(errorMessage);
        }).catch(err => {
            if (err) {
                console.log(err);
            }
        })
    }
}
async function getAnimalsByDateRange() {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    const from = prompt('Search start date: YYYY-MM-DD');
    const fromDate = new Date(from);

    if (from === null) return;
    if (!dateRegex.test(from)) {
        alert('Invalid date format.. format is YYYY-MM-DD')
        return;
    }

    const to = prompt('Search end date: YYYY-MM-DD');
    const toDate = new Date(to);

    if (to === null) return;
    if (!dateRegex.test(to)) {
        alert('Invalid date format.. format is YYYY-MM-DD')
        return;
    }
    if (toDate < fromDate) {
        alert('Incorrect range, from date cannot exceed the to date range');
        return;
    }

    const url = `http://localhost:3000/animals/animals-between-range?from=${from}&to=${to}`;
    if (dateRegex.test(from) && dateRegex.test(to)) {
        fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET',
        }).then(async response => {
            if (response.ok) {
                window.location.href = `/animals/animals-between-range?from=${from}&to=${to}`
            }
            else {
                const errorMessage = await response.text();
                alert(errorMessage);
            }
        }).catch(err => {
            console.error(err);
        });
    }
    else {
        alert('Invalid date ranges');
        return;
    }
}
async function getAnimalsPerSize() {
    const url = `http://localhost:3000/animals/animals-per-size`
    fetch(url, {
        headers: {
            'Content-Type': 'application.json'
        },
        method: 'GET',
    }).then(async response => {
        if (response.ok) {
            location.href = '/animals/animals-per-size';
        } else {
            const errorMessage = await response.text();
            console.error(errorMessage);
            alert(errorMessage);
        }
    }).catch(err => {
        console.error(err);
    })
}
async function getAnimalsByName() {
    const url = `http://localhost:3000/animals/sort-by-names`;
    fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
    }).then(async response => {
        if (response.ok) {
            location.href = '/animals/sort-by-names';
        } else {
            const errorMessage = await response.text();
            alert(errorMessage);
        }
    }).catch(err => {
        console.error(err);
    })
}
async function getAnimalsByAge() {
    const url = 'http://localhost:3000/animals/sort-by-age'
    fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
    }).then(async response => {
        if (response.ok)
            location.href = '/animals/sort-by-age';
        else {
            const errorMessage = await response.text();
            console.error(errorMessage);
        }
    })
}
async function getAdoptionDetails() {
    const url = 'http://localhost:3000/animals/all-adopted';

    fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
    }).then(async response => {
        if (response.ok)
            location.href = '/animals/all-adopted';
        else {
            const error = await response.text();
            console.error(error);
        }
    }).catch(err => {
        console.error(err);
    })

}
function allAnimals() {
    window.location.href = '/animals';
}