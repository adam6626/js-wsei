class Note {
    constructor(_title, _description, _color, _attached) {
        this.id = parseInt(Date.now() + Math.random() * 1000)
        this.title = _title
        this.description = _description
        this.color = _color
        this.attached = _attached
        this.createdTime = new Date()
    }
}

class NotePocket {
    constructor()
    {
        if(localStorage.getItem('NotePocket') === null)
        {
            this.Notes = [new Note('Hello', 'It is your first note.', '#ccc', true)]
            return;
        }

        try
        {
            this.Notes = JSON.parse(localStorage.getItem('NotePocket'))
        }
        catch(ex)
        {
            this.Notes = []
        }
    }

    add(note)
    {
        this.Notes.push(note)
        this.sortNotes()
        this.updateStorage()
    }

    remove(_id)
    {
        this.Notes = this.Notes.filter(note => note.id !== _id)
        this.updateStorage()
    }

    clean()
    {
        this.Notes = []
        this.updateStorage()
    }

    sortNotes()
    {
        this.Notes = this.Notes.sort((n1, n2) => this.compareMethod(n1, n2))
    }

    compareMethod(n1, n2)
    {
        if(n1.attached == true && n2.attached == false)
            return -1

        if(n1.attached == false && n2.attached == true)
            return 1

        if( new Date(n1.createdTime).getTime() > new Date(n2.createdTime).getTime() )
            return -1
        if( new Date(n1.createdTime).getTime() < new Date(n2.createdTime).getTime() )
            return 1

        return 0
    }

    updateStorage()
    {
        localStorage.setItem('NotePocket', JSON.stringify(this.Notes))
    }
}

function init()
{
    let pocket = new NotePocket()
    
    let newNoteButton = document.querySelector("#newNoteButton")
    let cleanNotesButton = document.querySelector("#cleanNotesButton")
    let addNoteButton = document.querySelector("#addNoteButton")
    let cancelButton = document.querySelector("#cancelButton")

    let titleField = document.querySelector("#title")
    let descriptionField = document.querySelector("#description")
    let colorField = document.querySelector("#color")
    let attachedField = document.querySelector("#attached")

    let addNoteContainer = document.querySelector("#addNoteContainer")
    let notesContainer = document.querySelector("#notesContainer")

    function cleanFields()
    {
        titleField.value = null
        descriptionField.value = null
        colorField.value = null
        attachedField.checked = false
    }

    function showAddNoteContainer()
    {
        addNoteContainer.classList.add('addnote-container--visible')
    }

    function hideAddNoteContainer()
    {
        addNoteContainer.classList.remove('addnote-container--visible')
    }

    function removeNote(id) 
    {
        pocket.remove(id)
        reloadNotes()
    }

    function reloadNotes()
    {
        notesContainer.innerHTML = "";

        pocket.Notes.forEach(function(note){
            notesContainer.innerHTML += renderNote(note)
        })

        let removeButtons = document.querySelectorAll(".note-remove")
        removeButtons.forEach(function(e){
            let _id = parseInt(e.dataset.noteid)
            e.addEventListener('click', function(){
                removeNote(_id)
            })
        })

    }

    function renderNote(note)
    {
        return `<div class="note">
            <div class="note-title">${note.title} <span style="background-color:${note.color};" class="dot"></span></div>
            <div class="note-createdtime">${new Date(note.createdTime).toLocaleString()}</div>
            <div class="note-description">${note.description}</div>
            <div class="note-footer">
                ${note.attached ? ' <div class="note-attached">Attached</div>' : ''}
                <button data-noteid="${note.id}" class="btn note-remove">Remove</button>
            </div>
        </div>`
    }

    newNoteButton.addEventListener('click', showAddNoteContainer);

    cleanNotesButton.addEventListener('click', function() {
        pocket.clean()
        reloadNotes()
    });

    addNoteButton.addEventListener('click', function() {
        let note = new Note(titleField.value, descriptionField.value, colorField.value, attachedField.checked)
        pocket.add(note)
        cleanFields()
        hideAddNoteContainer()
        reloadNotes()
    });

    cancelButton.addEventListener('click', function(){
        cleanFields()
        hideAddNoteContainer()
    });

    reloadNotes()
}

document.addEventListener('DOMContentLoaded', init)