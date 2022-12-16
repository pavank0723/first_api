import Joi from "joi"

const portfolioSchema = Joi.object(
    {
        title :Joi.string().required(),
        demo:Joi.string(),
        image:Joi.string(),
    }
)

export default portfolioSchema