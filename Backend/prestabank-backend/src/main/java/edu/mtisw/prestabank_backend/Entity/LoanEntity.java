package edu.mtisw.prestabank_backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;

@Getter
@Entity
@Table(name = "loan")//Prestamo
public class LoanEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private Long idUser;//Se agrega-        ID del usuario que solicito credito
    private int status; //                  indica si el credito esta: revision inicial(1), pendiente de documentacion(2), en evaluacion(3), pre-aprobado(4), arpobacion final(5), aprobada(6), rechazada(7), cancelada por el cliente(8), en desembolso(9)

    private int type; //Se agrega-          Tipo de credito,
    private double yearInterest;
    int maxDuration; //Se agrega-           Tiempo que pagara las cuotas, va por años
    //Quitado temporalmente: private int maxLoan; //Se agrega-       Maximo monto del credito (financiamiento tope)
    private int income; //Se agrega-        Ingresos mensuales (Revisar con combrobante)
    private int veteran; //Se agrega-       Anos de antiguedad en el empleo actual (Revisar con comprobante)
    private int totaldebt; //Se agrega-     Total de deudas

    private double monthlyPayment; //       Cuota mensual que se va a pagar M (Se calcula)
    private double loanAmount; //Se agrega- Monto del prestamo (capital) P
    private double monthlyInteresRate; //   Tasa de interes mensual (Tasa anual / 12 / 100) r
    private int totalPayments; //           Numero total de pagos (plazo en años x 12) n

    private double ingesurce;
    private double commission;
    private double totalCost;

    private int isIndependent;

    private ArrayList<Integer> saving; //   Puntos de capacidad de ahorro

    @Lob
    @Column(name = "papers", columnDefinition = "LONGBLOB") // Especificamos el tipo LONGBLOB para papers
    private byte[] papers; // Almacena el archivo PDF de la documentación

    private ArrayList<Integer> evalue; //   Listado que indica automaticamente las cosas 0=rechazado, 1=aprobado, 2=pendiente. 3=Requiere otra revision [R1, R2, R3, R4, R6, R7]


    public LoanEntity(Long idUser, int type, double yearInterest, int maxDuration, int maxLoan, int income, int veteran, int totaldebt, double monthlyPayment, double loanAmount, double monthlyInteresRate, int totalPayments, double ingesurce, double commission, double totalCost, int isIndependent, ArrayList<Integer> saving, byte[] papers, ArrayList<Integer> evalue) {
        this.idUser = idUser;
        this.status = 1;
        this.type = type;
        this.yearInterest = yearInterest;
        this.maxDuration = maxDuration;
        //this.maxLoan = maxLoan;
        this.income = income;
        this.veteran = veteran;
        this.totaldebt = totaldebt;
        this.monthlyPayment = monthlyPayment;
        this.loanAmount = loanAmount;
        this.monthlyInteresRate = monthlyInteresRate;
        this.totalPayments = totalPayments;
        this.ingesurce = ingesurce;
        this.commission = commission;
        this.totalCost = totalCost;
        this.isIndependent = isIndependent;
        this.saving = saving;
        this.papers = papers;
        this.evalue = evalue;
    }


    public LoanEntity() {this.status = 1; }// inicializamos con estatus Revicion inicial

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setType(int type) {
        this.type = type;
    }

    public void setYearInterest(double yearInterest) {this.yearInterest = yearInterest;}

    public void setMaxDuration(int maxDuration) {
        this.maxDuration = maxDuration;
    }

    /*
    public void setMaxLoan(int maxLoan) {
        this.maxLoan = maxLoan;
    }

     */

    public void setIncome(int income) {
        this.income = income;
    }

    public void setVeteran(int veteran) {
        this.veteran = veteran;
    }

    public void setTotaldebt(int totaldebt) {
        this.totaldebt = totaldebt;
    }

    public void setMonthlyPayment(double monthlyPayment) {
        this.monthlyPayment = monthlyPayment;
    }

    public void setLoanAmount(double loanAmount) {
        this.loanAmount = loanAmount;
    }

    public void setMonthlyInteresRate(double monthlyInteresRate) {
        this.monthlyInteresRate = monthlyInteresRate;
    }

    public void setTotalPayments(int totalPayments) {
        this.totalPayments = totalPayments;
    }

    public void setSaving(ArrayList<Integer> saving) {
        this.saving = saving;
    }

    public void setPdfContent(byte[] papers) {
        this.papers = papers;
    }

    public void setEvalue(ArrayList<Integer> evalue) {
        this.evalue = evalue;
    }

    public void setIsIndependent(int isIndependent) {this.isIndependent = isIndependent;}

    public void setId(Long id) {this.id = id;}

    public void setTotalCost(double totalCost) {this.totalCost = totalCost;}

    public void setCommission(double commission) {this.commission = commission;}

    public void setIngesurce(double ingesurce) {this.ingesurce = ingesurce;}

}

