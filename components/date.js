function DateTime()
{   
  
    const dateOfTransaction = new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
    const date = dateOfTransaction.slice(0,9);
    const time =dateOfTransaction.slice(11);
    const DateAndTime =  {
        Date:date,
        Time:time
    }
    return DateAndTime;
}


module.exports = DateTime;


