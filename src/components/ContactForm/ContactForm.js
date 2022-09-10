import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import { useForm } from 'react-hook-form';
import { Label, FormBox, Error } from './ContactForm.styled';
import { addContact, selectContactsItems } from '../../redux/AppSlice';

export const ContactForm = () => {
  const contacts = useSelector(selectContactsItems);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    resetField,
  } = useForm({
    defaultValues: { name: '', number: '' },
  });
  const nameValue = watch('name');
  const numberValue = watch('number');

  const handleNewContact = newContact => {
    if (!hasDuplicates(newContact.name)) {
      dispatch(addContact(newContact));
    } else {
      alert(`${newContact.name} is already in contacts.`);
    }
  };

  const hasDuplicates = duplicate => {
    return contacts.find(({ name }) => name === duplicate);
  };

  const onFormSubmit = () => {
    const newContact = {
      id: nanoid(),
      name: nameValue,
      number: numberValue,
    };

    handleNewContact(newContact);
    resetField('name');
    resetField('number');
  };

  return (
    <FormBox onSubmit={handleSubmit(onFormSubmit)} autoComplete="off">
      <Label>
        <span>Name</span>
        <input
          placeholder="John"
          value={nameValue}
          type="text"
          {...register('name', {
            required: { value: true, message: 'This field is required' },
            pattern: {
              value:
                /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/g,
              message:
                "Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan",
            },
          })}
        />
        {errors.name?.message && <Error>{errors.name?.message}</Error>}
      </Label>
      <Label>
        <span>Number</span>
        <input
          placeholder="1234567890"
          value={numberValue}
          {...register('number', {
            required: { value: true, message: 'This field is required' },
            pattern: {
              value:
                /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
              message:
                'Phone number must be digits and can contain spaces, dashes, parentheses and can start with +',
            },
          })}
          type="tel"
        />
        {errors.number?.message && <Error>{errors.number?.message}</Error>}
      </Label>
      <button type="submit">Add contact</button>
    </FormBox>
  );
};
