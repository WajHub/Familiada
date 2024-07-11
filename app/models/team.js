class Team {
    constructor(name, points) {
        this.name = name;
        this.points = points;
    }
    addPoints(points) {
        this.points += points;
    }
}

module.exports = Team;