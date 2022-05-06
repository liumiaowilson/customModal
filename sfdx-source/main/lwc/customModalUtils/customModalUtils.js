import LightningAlert from 'lightning/alert';

const [
    Symbol_InstanceName,
    Symbol_Parent,
] = (function() {
    const alertSymbols = Object.getOwnPropertySymbols(LightningAlert);
    let s_instanceName, s_parent;
    alertSymbols.forEach(symbol => {
        if(symbol.toString().includes('instanceName')) {
            s_instanceName = symbol;
        }
        else if(symbol.toString().includes('parent')) {
            s_parent = symbol;
        }
    });

    return [ s_instanceName, s_parent ];
})();

export const defineModal = (modalClass, modalTagName, modalParentClass) => {
    if(modalTagName) {
        modalClass[Symbol_InstanceName] = modalTagName;
    }

    if(modalParentClass) {
        modalClass[Symbol_Parent] = modalParentClass;
    }
};

export const getModal = () => LightningAlert;

export const getModalBase = () => LightningAlert[Symbol_Parent];

const proto = {
    add(className) {
        if (typeof className === 'string') {
            this[className] = true;
        } else {
            Object.assign(this, className);
        }
        return this;
    },
    invert() {
        Object.keys(this).forEach(key => {
            this[key] = !this[key];
        });
        return this;
    },
    toString() {
        return Object.keys(this)
            .filter(key => this[key])
            .join(' ');
    }
};

export function classSet(config) {
    if (typeof config === 'string') {
        const key = config;
        config = {};
        config[key] = true;
    }
    return Object.assign(Object.create(proto), config);
}
