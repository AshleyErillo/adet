document.addEventListener('DOMContentLoaded', function() {
    // Sample user data - in a real app, this would come from your backend
    const userData = {
        fullName: "Ashley Marie Erillo",
        email: "ashleyyyerillo@gmail.com",
        joinDate: "June 2025",
        pets: [
            {
                id: 1,
                name: "Yuri",
                type: "Cat",
                breed: "domestic shorthair",
                age: 8,
                weight: 5.0,
                gender: "male",
                photo: "yuricat.jpg"
            },
            {
                id: 2,
                name: "Mino",
                type: "Cat",
                breed: "domestic shorthair",
                age: 7,
                weight: 3.4,
                gender: "female",
                photo: "minocat.jpg"
            }
        ]
    };

    // Manage mode state
    let isManageMode = false;

    // DOM Elements
    const usernameDisplay = document.getElementById('username-display');
    const joinDate = document.getElementById('join-date');
    const fullNameDisplay = document.getElementById('full-name');
    const emailDisplay = document.getElementById('email');
    const fullNameInput = document.getElementById('full-name-input');
    const emailInput = document.getElementById('email-input');
    const petAvatarsContainer = document.getElementById('pet-avatars');
    const petsListContainer = document.getElementById('pets-list');
    const noPetsMessage = document.getElementById('no-pets-message');
    const addPetBtns = document.querySelectorAll('.add-pet-btn, #add-pet-btn-main');
    const addPetModal = document.getElementById('add-pet-modal');
    const closeModalBtns = document.querySelectorAll('.close-btn');
    const cancelAddPetBtn = document.getElementById('cancel-add-pet');
    const addPetForm = document.getElementById('add-pet-form');
    const managePetsBtn = document.getElementById('manage-pets-btn');
    
    // Edit Profile Modal Elements
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editProfileModal = document.getElementById('edit-profile-modal');
    const closeProfileModalBtn = document.getElementById('close-profile-modal');
    const cancelEditProfileBtn = document.getElementById('cancel-edit-profile');
    const saveProfileChangesBtn = document.getElementById('save-profile-changes');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Initialize the page with user data
    function initPage() {
        // Set user info
        usernameDisplay.textContent = userData.fullName.split(' ')[0];
        joinDate.textContent = userData.joinDate;
        fullNameDisplay.textContent = userData.fullName;
        emailDisplay.textContent = userData.email;
        
        // Set inputs with current values
        fullNameInput.value = userData.fullName;
        emailInput.value = userData.email;
        
        // Load pets
        loadPets();
    }

    // Toggle manage mode
    function toggleManageMode() {
        isManageMode = !isManageMode;
        managePetsBtn.textContent = isManageMode ? 'Done' : 'Manage';
        loadPets(); // Reload pets to show/hide remove buttons
    }

    // Load pets into the sidebar and main content
    function loadPets() {
        // Clear existing pets
        petAvatarsContainer.innerHTML = '';
        petsListContainer.innerHTML = '';
        
        if (userData.pets.length === 0) {
            noPetsMessage.style.display = 'block';
            return;
        }
        
        noPetsMessage.style.display = 'none';
        
        // Add pet avatars to sidebar
        userData.pets.forEach(pet => {
            const petAvatar = document.createElement('img');
            petAvatar.src = pet.photo || getDefaultPetImage(pet.type);
            petAvatar.alt = pet.name;
            petAvatar.className = 'pet-avatar';
            petAvatar.dataset.id = pet.id;
            petAvatar.addEventListener('click', () => scrollToPetCard(pet.id));
            petAvatarsContainer.appendChild(petAvatar);
        });
        
        // Add pet cards to main content
        userData.pets.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.className = 'pet-card';
            petCard.dataset.id = pet.id;
            
            petCard.innerHTML = `
                <div class="pet-actions">
                    <button class="edit-pet-btn" data-id="${pet.id}">Edit</button>
                    ${isManageMode ? `<button class="remove-pet-btn" data-id="${pet.id}">Remove</button>` : ''}
                </div>
                <img src="${pet.photo || getDefaultPetImage(pet.type)}" alt="${pet.name}">
                <span class="pet-type">${pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}</span>
                <h3>${pet.name}</h3>
                <p><strong>Breed:</strong> ${pet.breed || 'Unknown'}</p>
                <p><strong>Age:</strong> ${pet.age} years</p>
                <p><strong>Weight:</strong> ${pet.weight} ${pet.type === 'fish' ? 'grams' : 'kg'}</p>
                <p><strong>Gender:</strong> ${pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}</p>
            `;
            
            petsListContainer.appendChild(petCard);
        });

        // Add event listeners for edit and remove buttons
        addPetActionListeners();
    }

    // Add event listeners for pet edit and remove buttons
    function addPetActionListeners() {
        const editBtns = document.querySelectorAll('.edit-pet-btn');
        const removeBtns = document.querySelectorAll('.remove-pet-btn');

        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const petId = parseInt(e.target.dataset.id);
                editPet(petId);
            });
        });

        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const petId = parseInt(e.target.dataset.id);
                deletePet(petId);
            });
        });
    }

    // Edit pet function
    function editPet(petId) {
        const pet = userData.pets.find(p => p.id === petId);
        if (pet) {
            // Populate the add pet form with existing data
            document.getElementById('pet-name').value = pet.name;
            document.getElementById('pet-type').value = pet.type;
            document.getElementById('pet-breed').value = pet.breed || '';
            document.getElementById('pet-age').value = pet.age;
            document.getElementById('pet-weight').value = pet.weight;
            document.getElementById('pet-gender').value = pet.gender;
            
            // Change form title and button text
            addPetModal.querySelector('h2').textContent = 'Edit Pet';
            addPetModal.querySelector('button[type="submit"]').textContent = 'Update Pet';
            
            // Store the pet ID for updating
            addPetForm.dataset.editingId = petId;
            
            // Show modal
            addPetModal.style.display = 'flex';
        }
    }

    // Delete pet function
    function deletePet(petId) {
        const pet = userData.pets.find(p => p.id === petId);
        if (pet && confirm(`Are you sure you want to remove ${pet.name} from your pets?`)) {
            userData.pets = userData.pets.filter(p => p.id !== petId);
            loadPets();
            showToast(`${pet.name} has been removed from your pets.`);
        }
    }

    // Get default pet image based on type
    function getDefaultPetImage(petType) {
        const petImages = {
            dog: 'assets/default-dog.jpg',
            cat: 'assets/default-cat.jpg',
            bird: 'assets/default-bird.jpg',
            fish: 'assets/default-fish.jpg',
            reptile: 'assets/default-reptile.jpg',
            'small-mammal': 'assets/default-small-mammal.jpg',
            other: 'assets/default-pet.jpg'
        };
        return petImages[petType] || 'assets/default-pet.jpg';
    }

    // Scroll to pet card when avatar is clicked
    function scrollToPetCard(petId) {
        const petCard = document.querySelector(`.pet-card[data-id="${petId}"]`);
        if (petCard) {
            petCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Add highlight effect
            petCard.style.boxShadow = '0 0 0 3px #007bff';
            setTimeout(() => {
                petCard.style.boxShadow = '';
            }, 2000);
        }
    }

    // Show toast notification
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Tab switching functionality
    function switchTab(tabName) {
        // Remove active class from all tabs and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    // Event Listeners

    // Manage pets button
    if (managePetsBtn) {
        managePetsBtn.addEventListener('click', toggleManageMode);
    }

    // Edit Profile Modal
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            // Populate form with current data
            document.getElementById('profile-full-name').value = userData.fullName;
            document.getElementById('profile-email').value = userData.email;
            
            editProfileModal.style.display = 'flex';
        });
    }

    if (closeProfileModalBtn) {
        closeProfileModalBtn.addEventListener('click', () => {
            editProfileModal.style.display = 'none';
        });
    }

    if (cancelEditProfileBtn) {
        cancelEditProfileBtn.addEventListener('click', () => {
            editProfileModal.style.display = 'none';
        });
    }

    if (saveProfileChangesBtn) {
        saveProfileChangesBtn.addEventListener('click', () => {
            // Update user data from form
            userData.fullName = document.getElementById('profile-full-name').value;
            userData.email = document.getElementById('profile-email').value;
            
            // Update display
            fullNameDisplay.textContent = userData.fullName;
            emailDisplay.textContent = userData.email;
            usernameDisplay.textContent = userData.fullName.split(' ')[0];
            fullNameInput.value = userData.fullName;
            emailInput.value = userData.email;
            
            editProfileModal.style.display = 'none';
            showToast('Profile updated successfully!');
        });
    }

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            switchTab(tabName);
        });
    });

    // Add pet modal
    addPetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Reset form for new pet
            addPetForm.reset();
            addPetModal.querySelector('h2').textContent = 'Add New Pet';
            addPetModal.querySelector('button[type="submit"]').textContent = 'Save Pet';
            delete addPetForm.dataset.editingId;
            
            addPetModal.style.display = 'flex';
        });
    });

    // Close modal buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            addPetModal.style.display = 'none';
            editProfileModal.style.display = 'none';
        });
    });

    if (cancelAddPetBtn) {
        cancelAddPetBtn.addEventListener('click', () => {
            addPetModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addPetModal) {
            addPetModal.style.display = 'none';
        }
        if (e.target === editProfileModal) {
            editProfileModal.style.display = 'none';
        }
    });

    // Handle add/edit pet form submission
    if (addPetForm) {
        addPetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isEditing = addPetForm.dataset.editingId;
            const petData = {
                name: document.getElementById('pet-name').value,
                type: document.getElementById('pet-type').value,
                breed: document.getElementById('pet-breed').value || null,
                age: parseInt(document.getElementById('pet-age').value),
                weight: parseFloat(document.getElementById('pet-weight').value),
                gender: document.getElementById('pet-gender').value,
                photo: null // In a real app, you would handle file upload here
            };
            
            if (isEditing) {
                // Update existing pet
                const petId = parseInt(isEditing);
                const petIndex = userData.pets.findIndex(p => p.id === petId);
                if (petIndex !== -1) {
                    userData.pets[petIndex] = { ...userData.pets[petIndex], ...petData };
                    showToast(`${petData.name} has been updated!`);
                }
            } else {
                // Add new pet
                const newPet = {
                    id: Date.now(),
                    ...petData
                };
                userData.pets.push(newPet);
                showToast(`${petData.name} has been added to your pets!`);
            }
            
            // Reload pets and close modal
            loadPets();
            addPetModal.style.display = 'none';
            addPetForm.reset();
            delete addPetForm.dataset.editingId;
        });
    }

    // Initialize the page
    initPage();
});