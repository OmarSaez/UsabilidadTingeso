package edu.mtisw.prestabank_backend.Controller;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor

public class LoanSimulationRequest {
    private double loanAmount;
    private double yearInterestRate;
    private int yearPayments;

    public double getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(double loanAmount) {
        this.loanAmount = loanAmount;
    }

    public double getYearInterestRate() {
        return yearInterestRate;
    }

    public void setYearInterestRate(double yearInterestRate) {
        this.yearInterestRate = yearInterestRate;
    }

    public int getYearPayments() {
        return yearPayments;
    }

    public void setYearPayments(int yearPayments) {
        this.yearPayments = yearPayments;
    }
}
