package edu.mtisw.prestabank_backend.Service;

import edu.mtisw.prestabank_backend.Entity.LoanEntity;
import edu.mtisw.prestabank_backend.Entity.UserEntity;
import edu.mtisw.prestabank_backend.Repository.LoanRepository;
import edu.mtisw.prestabank_backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.Period;

import java.util.ArrayList;
import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;


@Service
public class LoanService {

    @Autowired
    LoanRepository loanRepository;

    @Autowired
    UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(LoanService.class); //MEnsaje por cosnla


    //rescatar todos los prestamos todo bien
    public ArrayList<LoanEntity> getLoans() {
        return (ArrayList<LoanEntity>) loanRepository.findAll();
    }

    //Rescata todos los loan por el ID de un user todo bien
    public ArrayList<LoanEntity> getLoansByIdUser(Long idUser) {
        return (ArrayList<LoanEntity>) loanRepository.findByIdUser(idUser);
    }

    //Guardar un prestamo todo bien
    public LoanEntity saveLoan(LoanEntity saveLoan, MultipartFile file) {

        try {
            if (file != null && !file.isEmpty()) {
                saveLoan.setPdfContent(file.getBytes());  // Guarda el contenido del PDF
            } else {
                saveLoan.setPdfContent(null);  // Deja espacio para agregar el PDF más tarde
            }
            logger.info("--El PDF guardado es:" + saveLoan.getPapers());
        } catch (IOException e) {
            saveLoan.setPdfContent(null);  // Establece null si ocurre un error
            logger.info("--Fallo al guardar el PDF");
            System.err.println("¡Error al procesar el archivo PDF: " + e.getMessage());
        }

        saveLoan.setIngesurce(insurance(saveLoan.getLoanAmount()));
        saveLoan.setCommission(commission(saveLoan.getLoanAmount()));
        saveLoan.setTotalCost(totalCost(saveLoan.getLoanAmount(), saveLoan.getIngesurce(), saveLoan.getCommission()));

        saveLoan.setMonthlyInteresRate(saveLoan.getYearInterest()/12/100);
        saveLoan.setTotalPayments(saveLoan.getMaxDuration()*12);

        Double CalculeMonthlyPayment = Calculo(saveLoan);
        saveLoan.setMonthlyPayment(CalculeMonthlyPayment);

        int EvalueWithR1 = paymentToIncome(saveLoan);
        logger.info("++Se completodo todo R1!");

        //R2 no se puede evaluar automaticamente

        int EvalueWithR3 = seniority(saveLoan);
        logger.info("++Se completodo todo R3!");

        int EvalueWithR4 = debtToIncome(saveLoan);
        logger.info("++Se completodo todo R4!");

        //R5 es tabla, se verifica en front, asi que siempre sera aprobado

        int EvalueWithR6 = yearOld(saveLoan);
        logger.info("++Se completodo todo R6!");

        //La primera vez que se guarda, no se puede ingresar los datos necesarios para usar la funcion R7, son datos proporcionador por el evaluador (ejecutivo), se pone R7=2 de pendiente

        ArrayList <Integer> newEvalue = new ArrayList<>(Arrays.asList(EvalueWithR1, 2, EvalueWithR3, EvalueWithR4, 1, EvalueWithR6, 2));

        saveLoan.setEvalue(newEvalue);

        logger.info("--Lista de la evualuacion automatica: {}", newEvalue);
        logger.info("++Se completodo todo el SERVICE, listo para guardar!");

        return loanRepository.save(saveLoan);
    }

    //Buscar un prestamo por su ID todo bien
    public LoanEntity getLoanById(Long id) {
        return loanRepository.findById(id).get();
    }

    //Borrar un prestamo todo bien
    public boolean deleteLoan(Long id) throws Exception {
        try {
            if (!loanRepository.existsById(id)) {
                throw new Exception("Loan not found");
            }
            loanRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception("Error deleting loan: " + e.getMessage());
        }
    }


    //Modificar un prestamo todo bien
    public LoanEntity updateLoan(LoanEntity changeLoan) {

        changeLoan.setIngesurce(insurance(changeLoan.getLoanAmount()));
        changeLoan.setCommission(commission(changeLoan.getLoanAmount()));
        changeLoan.setTotalCost(totalCost(changeLoan.getLoanAmount(), changeLoan.getIngesurce(), changeLoan.getCommission()));


        changeLoan.setMonthlyInteresRate(changeLoan.getYearInterest()/12/100);
        changeLoan.setTotalPayments(changeLoan.getMaxDuration()*12);
        changeLoan.setMonthlyPayment(Calculo(changeLoan));

        int EvalueWithR1 = paymentToIncome(changeLoan);

        //R2 no se puede evaluar automaticamente

        int EvalueWithR3 = seniority(changeLoan);

        int EvalueWithR4 = debtToIncome(changeLoan);

        //R5 es tabla, no se verifica aca

        int EvalueWithR6 = yearOld(changeLoan);

        //La primera vez que se guarda, no se puede ingresar los datos necesarios para usar la funcion R7, son datos proporcionador por el evaluador (ejecutivo), se pone R7=2 de pendiente

        ArrayList <Integer> newEvalue = new ArrayList<>(Arrays.asList(EvalueWithR1, changeLoan.getEvalue().get(1), EvalueWithR3, EvalueWithR4, 1, EvalueWithR6, 2));
        changeLoan.setEvalue(newEvalue);

        return loanRepository.save(changeLoan);
    }

    //Modificar un prestamo usado al momento de evaluar, ya que requiere entradas proporcionadas por un ejecutivo evaluador todo bien
    public LoanEntity updateLoanWithExcutive(LoanEntity changeLoan, int acountYears, ArrayList<Integer> balanceLast12) {
        logger.info("--Modificador de ejecutivo");
        logger.info("--Balance12: {}", balanceLast12);

        changeLoan.setIngesurce(insurance(changeLoan.getLoanAmount()));
        changeLoan.setCommission(commission(changeLoan.getLoanAmount()));
        changeLoan.setTotalCost(totalCost(changeLoan.getLoanAmount(), changeLoan.getIngesurce(), changeLoan.getCommission()));

        ArrayList<Integer> bankDeposit = new ArrayList<>(); //se inicia la lista de despositos
        ArrayList<Integer> withdrawals = new ArrayList<>();// se inicia la lista de retiros

        bankDeposit.add(1);
        withdrawals.add(0);
        int evalue = 0;
        for (int i = 1; i < balanceLast12.size(); i++){
            evalue = balanceLast12.get(i)-balanceLast12.get(i-1); //mes actual menos el mes anterior
            if (evalue >= 0){//Se es mayor que cero, se deposito
                bankDeposit.add(evalue);
                withdrawals.add(0);
            }else{//Si es negativo entonces se retiro dinero
                bankDeposit.add(0);
                withdrawals.add(evalue*(-1));
            }

        }
        logger.info("--retiros: {}", withdrawals);
        logger.info("--depositos: {}", bankDeposit);

        //Re calculo de la cuota
        changeLoan.setMonthlyInteresRate(changeLoan.getYearInterest()/12/100);
        changeLoan.setTotalPayments(changeLoan.getMaxDuration()*12);
        changeLoan.setMonthlyPayment(Calculo(changeLoan));

        //Evaluacion del prestamo
        int EvalueWithR1 = paymentToIncome(changeLoan);

        //R2 no se puede evaluar automaticamente

        int EvalueWithR3 = seniority(changeLoan);

        int EvalueWithR4 = debtToIncome(changeLoan);

        //R5 es tabla, no se verifica aca

        int EvalueWithR6 = yearOld(changeLoan);

        ArrayList<Integer> saving = savingSkills(changeLoan, acountYears, balanceLast12, bankDeposit, withdrawals);
        changeLoan.setSaving(saving);
        logger.info("Lista de la evaluacion de ahorro: {}", saving);
        int acum = 0;
        //Acumulador de los puntos de ahorro
        for (int i = 0; i < saving.size(); i++) {
            acum = saving.get(i) + acum;
        }

        int EvalueWithR7 = 2;

        if (acum >= 5){EvalueWithR7 = 1;}
        if (acum == 4){EvalueWithR7 = 3;}
        if (acum == 3){EvalueWithR7 = 3;}
        if (acum < 3){EvalueWithR7 = 0;}

        ArrayList<Integer> newEvalue = new ArrayList<>(Arrays.asList(EvalueWithR1, changeLoan.getEvalue().get(1), EvalueWithR3, EvalueWithR4, 1, EvalueWithR6, EvalueWithR7));
        changeLoan.setEvalue(newEvalue);

        return loanRepository.save(changeLoan);
    }

    // Calculo de la cuota mensual todo bien
    public double Calculo(LoanEntity loan) {

        // Calcular la parte superior de la fórmula de amortización
        double upPart = 1 + loan.getMonthlyInteresRate(); // Tasa de interés mensual
        upPart = Math.pow(upPart, loan.getTotalPayments()); // (1 + tasa)^n
        upPart = upPart * loan.getMonthlyInteresRate(); // (1 + tasa)^n * tasa

        double downPart = 1 + loan.getMonthlyInteresRate(); // Tasa de interes mensual
        downPart = Math.pow(downPart, loan.getTotalPayments()); // (1 + tasa)^n
        downPart = downPart - 1; // (1 + tasa)^n - 1

        double result = upPart / downPart; // Division
        result = result * loan.getLoanAmount(); // Calculo * el monto del prestamo

        return result; // Devuelve el resultado
    }


    //Buscar todos los prestamos por el estado de la solicitud todo bien
    public ArrayList<LoanEntity> getLoanByStatus(int status) {
        return (ArrayList<LoanEntity>) loanRepository.findByStatus(status);
    }

    //Busca todos los prestamos por el tipo todo bien
    public ArrayList<LoanEntity> getLoanByType(int type) {
        return (ArrayList<LoanEntity>) loanRepository.findByType(type);
    }

    //Simulacion de cuotas sin guardadar nada mediante un endpoint
    public double simulateLoan(double loanAmount, double yearInterestRate, int yearPayments) {

        logger.info("--Se entro al simulador de creditos bien");

        double monthlyInterestRate = yearInterestRate/12/100;
        int totalPayments = yearPayments*12;

        // Cálculo de la cuota mensual basado en la fórmula de amortización
        double upPart = Math.pow(1 + monthlyInterestRate, totalPayments) * monthlyInterestRate;
        double downPart = Math.pow(1 + monthlyInterestRate, totalPayments) - 1;
        double monthlyPayment = (upPart / downPart) * loanAmount;

        logger.info("--Valor final calculado: {}", monthlyPayment);
        return monthlyPayment;
    }

    public double insurance(double loanAmount){
        return loanAmount*0.0003;
    }
    public double commission(double loanAmount){
        return loanAmount*0.01;
    }
    public double totalCost(double loanAmount, double insurance, double commission){
        logger.info("--La suma del costo total es {} + {} + {} + 20000", loanAmount, insurance, commission);
        return loanAmount+insurance+commission+20000;
    }

    //------Metodos de evaluacion en automatico----------

    //Calcular edad todo bien
    public static int calcularYearOld(int diaNacimiento, int mesNacimiento, int anioNacimiento) {
        // Crear un objeto LocalDate con la fecha de nacimiento
        LocalDate fechaNacimiento = LocalDate.of(anioNacimiento, mesNacimiento, diaNacimiento);

        // Obtener la fecha actual
        LocalDate fechaActual = LocalDate.now();

        // Calcular la edad usando Period
        Period periodo = Period.between(fechaNacimiento, fechaActual);

        // Devolver la cantidad de años
        return periodo.getYears();
    }

    //R1 relacion cuotas ingresos, si es mayor 35% se rechaza todo bien
    public int paymentToIncome(LoanEntity loan) {
        int income = loan.getIncome();
        double monthlyPayment = loan.getMonthlyPayment();
        double ratio = (monthlyPayment / income) * 100;

        if (ratio > 35) {
            return 0;
        } else {
            return 1;
        }
    }

    //R2 historial, no es posible evaluar se pone 2 de pendiente

    //R3 se ve la antiguedad laboral todo bien
    public int seniority(LoanEntity loan) {
        int veteran = loan.getVeteran();
        if (veteran < 2) {
            return 0;
        } else {
            return 1;
        }
    }

    //R4 ver la relacion deuda ingreso todo bien
    public int debtToIncome(LoanEntity loan) {
        int income = loan.getIncome();
        double debt = loan.getTotaldebt()+loan.getMonthlyPayment();
        double ratio = (debt / income) * 100;
        logger.info("Deuda total {} + {} = {}", loan.getTotaldebt(), loan.getMonthlyPayment(), debt);
        logger.info("Ratio: {} / {} = {}", debt, income, ratio);

        if (ratio > 50) {
            return 0;
        } else {
            return 1;
        }
    }

    //R5 es una condicional de tabla y es ase limita en otro lado el monto a pedir maximo

    //R6 verificar la edad del solicitante todo bien
    public int yearOld(LoanEntity loan) {
        Long idUser = loan.getIdUser();

        UserEntity user = userRepository.findById(idUser).get();
        int edad = calcularYearOld(user.getBirthDay(), user.getBirthMonth(), user.getBirthYear());

        if (edad > 69) {
            return 0;
        } else {
            return 1;
        }
    }

    //R7 Verificar la capacidad de ahorro, se utiliza una tabla de puntaje

    //(Credito, Frecuencia de depositos, Años de antiguedad de la cuenta, list(Saldo ultimos 12 meses), list(Retiro de los ultimos 12 meses)
    public ArrayList<Integer> savingSkills(LoanEntity loan, int acountYears, ArrayList<Integer> balanceLast12, ArrayList<Integer> bankDeposit, ArrayList<Integer> withdrawals) {
        ArrayList<Integer> listEvalue = new ArrayList<>();
        //agregamos R71
        listEvalue.add(minBalance(balanceLast12.get(0), loan.getLoanAmount()));
        //Agregamos R72
        listEvalue.add(recordSaving(balanceLast12, withdrawals));
        //Agregamos R73
        listEvalue.add(periodicDeposits(bankDeposit, loan.getIncome()));
        //Agremos R74
        listEvalue.add(ratioBalanceVeteran(acountYears, balanceLast12, loan.getLoanAmount()));
        //Agregamos R75
        listEvalue.add(recentWithdrawals(withdrawals, balanceLast12));

        return listEvalue;
    }

    //R71 saldo minimo del 10% del prestamo solicitado, aca loan es el prestamo en numero, no la entidad
    public int minBalance(int balance, double loan) {
        logger.info("--Requisito de ahorro1");
        double tenPercentage = loan * 0.1;
        if (balance >= tenPercentage) {
            return 1;
        } else {
            return 0;
        }
    }

    //R72 Saldo positivo los ultimos 12 meses y no retiros del mas del 50%
    public int recordSaving(ArrayList<Integer> balanceLast12, ArrayList<Integer> last12Withdrawals) {
        logger.info("--Requisito de ahorro2");
        //Ciclo que analiza los saldos de los 12 meses
        for (int i = 0; i < balanceLast12.size(); i++) {
            int value = balanceLast12.get(i);
            if (value <= 0) {
                return 0;
            }
        }

        for (int i = 1; i < last12Withdrawals.size(); i++) {

            int value = last12Withdrawals.get(i);
            int balance = balanceLast12.get(i-1);
            if (value > balance * 0.5) {
                return 0;
            }
        }

        return 1;//Si ya paso ambos ciclos significa que esta todo bien
    }

    //R73 verificar si los depositos son periodicos y la suma total suman almenos un 5% del ingreso mensual
    public int periodicDeposits(ArrayList<Integer> bankDeposit12, int income) {
        logger.info("--Requisito de ahorro3");
        int frecuencyDeposits = 0;

        int acum = 0;
        //Acumulador que calcula el saldo total de los ultimos 12 meses
        for (int i = 0; i < bankDeposit12.size(); i++) {
            acum = bankDeposit12.get(i) + acum;
            if (bankDeposit12.get(i) > 0){
                frecuencyDeposits = frecuencyDeposits + 1;
            }
        }

        frecuencyDeposits = frecuencyDeposits/12;

        //Verifica la frecuencia de deposito
        if (frecuencyDeposits > 3) {
            logger.info("++ la frecuencia de depositos no es fuciente {}", frecuencyDeposits);
            return 0;
        }

        //verifica si el acumulado es mayor al 5% del ingreso mensual
        logger.info("--Acum de los depositos: {}, ingresos: {}", acum, income);
        if (acum < income * 0.05) {
            return 0;
        } else {
            return 1;
        }
    }


    //R74 Si la cuenta de ahorros tiene menos de 2 años el acum debe ser 20% del prestamo solicitado
    public int ratioBalanceVeteran(int acountYears, ArrayList<Integer> balanceLast12, double loan) {
        logger.info("--Requisito de ahorro4");
        //NOTA: ACA LOAN ES EL VALOR DEL PRESTAMO, NO ES LA ENTIDAD LOAN
        int acum = 0;
        //Acumulador que calcula el saldo total de los ultimos 12 meses
        for (int i = 0; i < balanceLast12.size(); i++) {
            acum = balanceLast12.get(i) + acum;
        }

        //Consulta cuantos años tiene la cuenta
        if (acountYears < 2) {
            if (acum < loan * 0.2) {
                return 0;
            } else {
                return 1;
            }

            //Si es mayor a 2 años, que el acum solo sea mayor al 10% del prestamo
        } else if (acum < loan * 0.1) {
            return 0;
        } else {
            return 1;
        }
    }

    //R75 verifica si los retiros de los ultimos 6 meses son mayores a 30% del saldo actual, PENDIENTE LIMITAR A SOLO 6 MESES, se puede hacer con el largo de la lista
    public int recentWithdrawals(ArrayList<Integer> last12Withdrawals, ArrayList<Integer> balance12){
        logger.info("--Requisito de ahorro5");
        int large = last12Withdrawals.size();
        large = large-5;
        for (int i = 0; i < large; i++) {
            int withdrawal = last12Withdrawals.get(i+1);
            int balance = balance12.get(i);
            if (withdrawal > balance * 0.3) {return 0;}
        }
        //si registro todos los meses y no retorno cero, entonces esta aprobado este punto
        return 1;
    }

}
