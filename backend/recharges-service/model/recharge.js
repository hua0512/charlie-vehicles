class Recharge {
    constructor(id, userId, vehicleId, chargerpointId, price, kw, status, payment, dateStart, dateEnd) {
        this.id = id;
        this.userId = userId;
        this.vehicleId = vehicleId;
        this.chargerpointId = chargerpointId;
        this.price = price;
        this.kw = kw;
        this.status = status; // 'NotStarted', 'Charging', 'Completed'
        this.payment = payment; // 'NotProcessed', 'Cancelled', 'Pending', 'Completed'
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
    }
}

const RechargeStatus = Object.freeze({
    NOT_STARTED: 'NotStarted',
    CHARGING: 'Charging',
    COMPLETED: 'Completed'
});

const PaymentStatus = Object.freeze({
    NOT_PROCESSED: 'NotProcessed',
    CANCELLED: 'Cancelled',
    PENDING: 'Pending',
    COMPLETED: 'Completed'
});

module.exports = { Recharge, RechargeStatus, PaymentStatus };
