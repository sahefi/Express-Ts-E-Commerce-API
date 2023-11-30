import { body } from "express-validator"

export const registerValidator=[
    body('username').notEmpty().withMessage('Username Cannot Be Empty').isString().withMessage('Username Must Be String'),
    body('password').notEmpty().withMessage('Password Cannot Be Empty').isString().withMessage('Password Must Be String'),
    body('name').notEmpty().withMessage('Name Cannot Be Empty').isString().withMessage('Name Must Be String'),
    body('email').notEmpty().withMessage('email Cannot Be Empty').isEmail().withMessage('Email Not Valid'),
    body('birth').notEmpty().withMessage('Birth Cannot Be Empty').isString().withMessage('Birt Must Be String'),
    body('no_phone').notEmpty().withMessage('No_phone Cannot Be Empty').isString().withMessage('No_phone Must Be String'),
]

export const updateCustomerValidator=[
    body('id').notEmpty().withMessage('ID Cannot Be Empty').isString().withMessage('ID Must Be String'),
    body('username').notEmpty().withMessage('Username Cannot Be Empty').isString().withMessage('Username Must Be String'),
    body('name').notEmpty().withMessage('Name Cannot Be Empty').isString().withMessage('Name Must Be String'),
    body('email').notEmpty().withMessage('email Cannot Be Empty').isEmail().withMessage('Email Not Valid'),
    body('birth').notEmpty().withMessage('Birth Cannot Be Empty').isString().withMessage('Birt Must Be String'),
    body('no_phone').notEmpty().withMessage('No_phone Cannot Be Empty').isString().withMessage('No_phone Must Be String'),
]

export const createStaffValidator=[
    body('username').notEmpty().withMessage('Username Cannot Be Empty').isString().withMessage('Username Must Be String'),
    body('password').notEmpty().withMessage('Password Cannot Be Empty').isString().withMessage('Password Must Be String'),
    body('name').notEmpty().withMessage('Name Cannot Be Empty').isString().withMessage('Name Must Be String'),
    body('email').notEmpty().withMessage('email Cannot Be Empty').isEmail().withMessage('Email Not Valid'),
    body('no_phone').notEmpty().withMessage('No_phone Cannot Be Empty').isString().withMessage('No_phone Must Be String'),
]