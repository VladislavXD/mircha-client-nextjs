import React from "react";
import {Alert, Button} from "@heroui/react";
import { CiGift } from "react-icons/ci";

export default function Notice() {
  const [isVisible, setIsVisible] = React.useState(true);

  const title = "";
  const description =
    "";

  return (
    <div className="flex flex-col gap-4">
      
        <Alert
          color="default"
          description={<>
            <p><em>
              и желает чтобы все лучшее и прекрасное случилось в новом 2026 году. Пусть грядущие 12 месяцев принесут вам яркие идеи, новые знакомства и моменты, которые хочется запомнить.
            </em>
              <br/><i><u>✨ С праздником и до встречи в новом году!</u></i></p>
          </>}
          isVisible={isVisible}
          title={<>
          <p><strong><i>Команда Mirchan поздравляет вас с Новым годом</i></strong></p>
          </>}
          variant="faded"
          icon={<CiGift className="w-10 h-10"/>}
          onClose={() => setIsVisible(false)}
        />
    
    </div>
  );
}

