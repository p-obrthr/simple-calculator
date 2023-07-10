import { useState, useRef } from 'react';

function App() {
	const [calc, setCalc] = useState("");
	const [result, setResult] = useState("");
	const [memory, setMemory] = useState(0);

	const bracketsRef = useRef(0);

	const ops = ['+', '-', '*', '/', '.'];
	const sp = ['²', '√', '%', 'x!'];
	const bra = ['(', ')'];

	const updateCalc = value => {
		if(
			(ops.includes(value) && calc === '') ||
			(ops.includes(value) && ops.includes(calc.slice(-1)))
		) {
			return;
		}

		if (sp.includes(value)) {
			
			switch (value) {
				case '²':
					setCalc((prevCalc) => {
						const calculated = (prevCalc*prevCalc).toString();
						setResult(calculated);
						return calculated;
					});
					break;
				case '√':
					setCalc((prevCalc) => {
						const calculated = (Math.sqrt(prevCalc).toFixed(5)).toString();
						setResult(calculated);
						return calculated;
					});
					break;
				case '%':
					setCalc((prevCalc) => {
						const calculated = (prevCalc/100);
						setResult(calculated);
						return calculated;
					});
					break;
				case 'x!':
					setCalc((prevCalc) => {
							if (prevCalc === 0 || prevCalc === 1) {
								return 1;
							}
							let result = 1;
							for (let i = 2; i <= prevCalc; i++) {
								result *= i;
							}
							setResult(result);
							return result;
					});
					break;
				default:
					break;
			}

			return;
		}

		if (bra.includes(value)) {
			if (value === '(') {
				bracketsRef.current += 1;
			} else {
				bracketsRef.current -= 1;
			}
		}


		setCalc(calc + value);

		if (!ops.includes(value) && bracketsRef.current === 0) {
			setResult(eval(calc + value).toString());
		}
	
	}

	const createDigits = () => {
		const digits = [];

		for (let i =1; i<10; i++) {
			digits.push(
				<button 
					onClick={() => updateCalc(i.toString())} 
					key={i}>
					{i}
				</button>
			)
		}
		return digits;
		
	}

	const trig = sub => {
		if (calc === '') {
			return;
		}
		const angleInRadians = degreesToRadians(parseFloat(calc));
		switch(sub) {
			case 'sin':
				setCalc(Math.sin(angleInRadians));
				setResult(Math.sin(angleInRadians).toString());
				break;
			case 'cos':
				setCalc(Math.cos(angleInRadians));
				setResult(Math.cos(angleInRadians).toString());
				break;
			case 'tan':
				setCalc(Math.tan(angleInRadians));
				setResult(Math.tan(angleInRadians).toString());
				break;
			default:
				break;
		}

	}

	const degreesToRadians = degrees => {
		return degrees * (Math.PI / 180);
	};

	const calculate = () => {
		if (calc === '' || bracketsRef.current !== 0) {
			return;
		}
		setCalc(eval(calc).toString());
		setResult("");
	}

	const deleteLast = () => {
		if (calc === '') {
			return;
		}

		const value = calc.slice(0, -1);

		setCalc(value);
	}

	const resetset = () => {
		if (calc === '') {
			return;
		}
		setCalc("");
		setResult("");
	}

	const saveMemory = () => {
		if (calc === '') {
			return;
		}
		setMemory(eval(calc).toString());
	}

	const clearMemory = () => {
		setMemory(0);
	}



	return (
		<div className="App">
			<div className ="calculator">
				<div className ="display">
					{ result ? <span>({result}) </span> : ''} 
					{ calc || "0" }
				</div>
				<div className ="operators">
					<button onClick={() => updateCalc('+')}>+</button>
					<button onClick={() => updateCalc('-')}>-</button>
					<button onClick={() => updateCalc('*')}>×</button>
					<button onClick={() => updateCalc('/')}>÷</button>

					<button onClick={deleteLast}>DEL</button>
					<button onClick={resetset}>C</button>

				</div>


				<div className = "specials">
					<button onClick={() => updateCalc(((Math.PI).toFixed(5)).toString())}>π</button>
					<button onClick={() => updateCalc('²')}>²</button>
					<button onClick={() => updateCalc('√')}>√</button>
					<button onClick={() => updateCalc('%')}>%</button>

					<button onClick={() => memory === 0 ? saveMemory(): updateCalc(memory) }>M</button>
					<button onClick={ clearMemory }>MR</button>
				</div>

				<div className = "others">
					<button onClick={() => updateCalc('(')}>(</button>
					<button onClick={() => updateCalc(')')}>)</button>
					<button onClick={() => updateCalc('x!')}>x!</button>
					<button onClick={() => trig('sin')}>sin</button>
					<button onClick={() => trig('cos')}>cos</button>
					<button onClick={() => trig('tan')}>tan</button>
				</div>

				<div className="digits">
					{createDigits()}
					<button onClick={() => updateCalc('0')}>0</button>
					<button onClick={() => updateCalc('.')}>.</button>
					<button onClick={ calculate }>=</button>
				</div>
			</div>
		</div>
	);
}

export default App;
