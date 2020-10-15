import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup: FormGroup;

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0 ;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  constructor(private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService,
    private cartService : CartService
                    ) { }

  ngOnInit(): void {
   
    this.listCartDetails();
    this.checkoutFormGroup = this.formBuilder.group({

      customer: this.formBuilder.group({
        firstName: new FormControl ('',
                                    [Validators.required,
                                    Validators.minLength(2), 
                                    Luv2ShopValidators.notOnlyWhitespace]),

        lastName: new FormControl ('',
                                  [Validators.required,
                                   Validators.minLength(2),
                                   Luv2ShopValidators.notOnlyWhitespace]),

        email: new FormControl ('', 
                                [Validators.required,
                                 Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
                                 Luv2ShopValidators.notOnlyWhitespace])
      }),

      shippingAddress: this.formBuilder.group({
        
        street: new FormControl ('',
                                [Validators.required,
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl ('',
                              [Validators.required,
                              Validators.minLength(2),
                              Luv2ShopValidators.notOnlyWhitespace]),
        
        zipCode: new FormControl ('',
                                  [Validators.required,
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhitespace]),

        country:  new FormControl ('',[Validators.required]),
        state: new FormControl ('',[Validators.required]),
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl ('',
                                [Validators.required,
                                Validators.minLength(2),
                                Luv2ShopValidators.notOnlyWhitespace]),
        city: new FormControl ('',
                              [Validators.required,
                              Validators.minLength(2),
                              Luv2ShopValidators.notOnlyWhitespace]),
        
        zipCode: new FormControl ('',
                                  [Validators.required,
                                  Validators.minLength(2),
                                  Luv2ShopValidators.notOnlyWhitespace]),

        country:  new FormControl ('',[Validators.required]),
        state: new FormControl ('',[Validators.required]),
      }),

      creditCard: this.formBuilder.group({
        cardType: new FormControl ('',[Validators.required]),
        nameOnCard: new FormControl ('',
                                    [Validators.required,
                                    Validators.minLength(2),
                                    Luv2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl ('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl ('',[Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    //------------------------------------------------------------------------------------
    // populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
    //------------------------------------------------------------------------------------

    //--------------------------------------------------------------------------------
    // populate credit card years
    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credi card years : " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )
  //----------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------
  // populate countries 
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries : " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }
  //----------------------------------------------------------------------------------

  //----------------------------------------------------------------------------------
  onSubmit() {

    
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid){
        this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer').value);

    console.log("The shipping address country is " +this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address state is " +this.checkoutFormGroup.get('shippingAddress').value.state.name);
  }


  //------------------Getter methods to access to customer form control-------------------------
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

   //-----------------Getter methods to access to shippingAddress form control-------------------------
   get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
   get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
   get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
   get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
   get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

     //-----------------Getter methods to access to creditCard form control-------------------------
     get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
     get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
     get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
     get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
     


     //-----------------Getter methods to access to billingAddress form control-------------------------
     get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
     get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
     get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
     get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
     get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
     

     //----------------------------------------------------------------------------------
     listCartDetails() {
      // get a handle to the cart items
      this.cartItems = this.cartService.cartItems;
  
      // subscribe to the cart totalPrice
      this.cartService.totalPrice.subscribe(
        data => this.totalPrice = data 
      );
      
      // subscribe to the cart totalQuantity
      this.cartService.totalQuantity.subscribe(
        data => this.totalQuantity = data 
      );
      
      // compute cart total price and quantity
      this.cartService.computeCartTotals();
      console.log(`priceeeeeeeeeee ${this.totalPrice}`);
      console.log(`Qunantityyyyyyy ${this.totalQuantity}`);
    }
     
  //----------------------------------------------------------------------------------
  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

        // bug fix for states
        this.billingAddressStates = this.shippingAddressStates;
    }

    else {
      this.checkoutFormGroup.controls.billingAddress.reset();

      // bug fix for states
      this.billingAddressStates = [] ;
    }

  }

  //----------------------------------------------------------------------------------
  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getUTCFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals selected year, then start with current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log('Retrieve credit card months : ' + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )

  }
  //------------------------------------------------------------------------------------ 

  //----------------------------------------------------------------------------------
  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code : ${countryCode}`);
    console.log(`${formGroupName} country name : ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }
 //------------------------------------------------------------------------------------

}


