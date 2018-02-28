const singleActionMapper = {}
const singleModel = {}
const singleService = {}
const singleActionTypes = {}


const getStore = (model={}, map={}) => {
    _addModel(model)
    _addMap(map)
    const o = {
        exeAction: _exeAction,
    }
    return o
}

const _addModel = (extraModel) => {
    Object.keys(extraModel).forEach((k) => {
        if (singleModel[k]) {
            return false
        } else {
            singleModel[k] = extraModel[k]
        }
    })
}

const _isFunction = (o) => {
    return Object.prototype.toString.apply(o) === '[object Function]'

}

const _addMap = (extraMap) => {
    Object.keys(extraMap).forEach((k) => {
        const func = extraMap[k]
        if (_isFunction(func)) {
            if (singleActionMapper[k]) {
                return false
            } else {
                singleActionMapper[k] = func(singleService, singleModel)
            }
        } else {
            console.error(`${k} is not a function`)
            return false
        }
    })
}

const _exeAction = (action) => {
    const { type, data, control } = action
    if (singleActionMapper) {
        const func = singleActionMapper[type]
        console.log('type and data', type, func, data, control)
        func(data, control)
    }
}

const addService = (options) => {
    console.log('options service', options)
    Object.keys(options).forEach((k) => {
        const func = options[k]
        if (_isFunction(func)) {
            if (singleService[k]) {
                return false
            } else {
                singleService[k] = (data) => {
                    const ajaxOptions = func(data)
                    const instance = _factory(ajaxOptions)
                    return instance
                }
            }
        }
    })
}

const _factory = (options) => {
    const p = new Promise((resolve, reject) => {
        const successFunc = options.success
        const errorFunc = options.error
        options.success = (data) => {
            successFunc(data)
            resolve(data)
        }
        options.error = (e) => {
            errorFunc(e)
            reject(e)
        }

        // $.ajax(options)
    })
    return p
}

const _addActionTypes = (types) => {
    Object.keys(types).forEach((k) => {
        if (singleActionTypes[k]) {
            return false
        } else {
            singleActionTypes[k] = types[k]
        }
    })
}

const applyCollection = (collection) => {
    const model = collection._model
    const service = {}
    const mapper = {}
    const actionTypes = {}
    delete collection._model

    Object.keys(collection).forEach((k) => {
        const v = collection[k]
        actionTypes[k] = k
        if (v.service) {
            console.log('debug v service', v.service)
            service[k] = v.service
        }
        mapper[k] = v.action
    })
    collection._model = model

    getStore(model, mapper)
    addService(service)
    _addActionTypes(actionTypes)
    return singleActionTypes
}