const model = require('../models/activity');
const rsvp = require('../models/rsvp');

exports.index = (req, res, next)=>{
    model.find()
    .then(activities => res.render('./activity/connections', {activities}))
    .catch(err=>next(err));
};

exports.new = (req, res)=>{
    res.render('./activity/newConnection');
};

exports.create = (req, res)=>{
    
    let activity = new model(req.body); //create new doc
    activity.host = req.session.user;
    activity.save() //insert doc to database
    .then((activity) => {
        req.flash('success', 'Connection was successfully created');
        res.redirect('/activity');
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            req.flash('error', err.message);
            err.status = 400;
        }
        next(err)
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    model.findById(id).populate('host', 'firstName lastName')
        .then(activity => {
            rsvp.find({ activity: id, status: 'Yes'})
            .then(rsvp => {
            if (activity) {
                return res.render('./activity/connection', {activity, rsvp });
            } else {
                let err = new Error('Cannot find a connection with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
  })
.catch(err => next(err));
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    }

    model.findById(id)
        .then(activity => {
            if(activity) {
                return res.render('./activity/edit', {activity});
            } else {
                let err = new Error('Cannot find a connection with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err=>next(err));
}; 

exports.update = (req, res, next)=>{
    let activity = req.body;
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    }

model.findByIdAndUpdate(id, activity, {useFindAndModify:false, runValidators: true})
.then(activity=> {
        res.redirect('/activity/'+id);
})
.catch(err=> {
    if(err.name === 'ValidationError') {
        req.flash('error', err.message);
        return res.redirect('/back');
    }
    next(err);
});
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;
    model.findByIdAndDelete(id, {useFindAndModify: false})
.then(activity => {
    rsvp.deleteMany({ activity: id })
    .then(rsvp => {
        req.flash('success', 'Connection and RSVPs were deleted successfully!');
        res.redirect('/connections');
    })
    .catch(err => next(err));
})
.catch(err => next(err));
};

exports.rsvp = (req, res, next) => {
    let id = req.params.id;
    rsvp.findOne({ connection: id, attendee: req.session.user })
        .then(result => {
            if (!result) {
                let rsvp = new rsvp(req.body);
                rsvp.connection = id;
                rsvp.attendee = req.session.user;
                rsvp.save()
                    .then(rsvp => {
                        req.flash('success', 'You have successfully RSVP\'\d for this event!');
                        res.redirect('/users/profile');
                    })
                    .catch(err => next(err));
            } else {
                let rsvpp = req.body;
                rsvp.findOneAndUpdate({ connection: id, attendee: req.session.user }, rsvpp, { useFindAndModify: false, runValidators: true })
                    .then(connection => {
                        req.flash('success', 'RSVP status was updated successfully!');
                        res.redirect('/users/profile');;
                    })
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err))
}