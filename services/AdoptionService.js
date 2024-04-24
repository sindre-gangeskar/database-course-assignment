class AdoptionService {
    constructor(db) {
        this.sequelize = db.sequelize;
        this.Adoption = db.Adoption;
        this.Animal = db.Animal;
    }
    
    async getAll() {
        return await this.Adoption.findAll({ include: [ { model: this.Animal } ] });
    }
    async getById(animalId) {
        return await this.Adoption.findOne({ where: { AnimalId: animalId } })
    }
    async create(userId, animalId) {
        try {
            return await this.Adoption.create({ UserId: userId, AnimalId: animalId });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                console.error('Adoption already exists for animal id:', animalId);
            }
        }
    }
}

module.exports = AdoptionService;